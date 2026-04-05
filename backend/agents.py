"""
AlertBridge 3-Agent Pipeline
Agent 1: Extraction — parses raw alert into structured facts
Agent 2: Adaptation — rewrites for a specific community profile
Agent 3: Formatting — outputs WhatsApp, SMS, and Voice versions
"""

import json
import requests
import os

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"


def call_groq(system_prompt: str, user_message: str) -> str:
    """Call the Groq API with a system prompt and user message."""
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    body = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.3,
        "max_tokens": 2048,
    }
    try:
        response = requests.post(GROQ_URL, headers=headers, json=body, timeout=30)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        return json.dumps({"error": str(e)})


# ─────────────────────────────────────────────
# AGENT 1 — Extraction
# ─────────────────────────────────────────────
EXTRACT_SYSTEM = """You are a disaster alert analyst specializing in Indian meteorological and disaster management bulletins from IMD, NDMA, CWC, and state disaster agencies.

Your job is to extract structured facts from a raw government alert. 

Return ONLY a valid JSON object with these exact keys:
{
  "hazard_type": "cyclone | flood | storm_surge | earthquake | landslide | heatwave | cloudburstd | tsunami",
  "severity": "low | medium | high | critical",
  "alert_level": "Green | Yellow | Orange | Red",
  "affected_areas": ["list", "of", "place", "names"],
  "time_of_impact": "when will it hit — specific time or timeframe",
  "wind_speed": "if applicable, otherwise null",
  "rainfall": "if applicable, otherwise null",
  "storm_surge_height": "if applicable, otherwise null",
  "river_level": "if applicable (for floods), otherwise null",
  "danger_level": "if applicable (for floods), otherwise null",
  "recommended_actions": ["list of concrete actions people should take"],
  "source_agency": "IMD | NDMA | CWC | State agency name",
  "summary": "One sentence plain-English summary of what is happening"
}

Rules:
- Return ONLY valid JSON. No markdown, no explanations, no extra text.
- If a field is not mentioned in the alert, set it to null.
- For severity: Red Alert = critical, Orange Alert = high, Yellow Alert = medium, Green = low.
- Extract ALL place names mentioned.
"""


def agent_extract(alert_text: str) -> dict:
    """Agent 1: Extract structured facts from raw alert text."""
    result = call_groq(EXTRACT_SYSTEM, alert_text)
    # Try to parse JSON from the response
    try:
        # Handle cases where the model wraps JSON in markdown code blocks
        cleaned = result.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
        return json.loads(cleaned.strip())
    except json.JSONDecodeError:
        return {
            "hazard_type": "unknown",
            "severity": "high",
            "alert_level": "Orange",
            "affected_areas": [],
            "time_of_impact": "imminent",
            "recommended_actions": ["Stay alert and follow local authority instructions"],
            "summary": alert_text[:200],
            "raw_response": result
        }


# ─────────────────────────────────────────────
# AGENT 2 — Cultural Adaptation
# ─────────────────────────────────────────────
ADAPT_SYSTEM_TEMPLATE = """You are a disaster communication expert writing for a vulnerable community in India.

Community profile:
- Language: {language}
- Literacy level: {literacy}
- Nearest shelter: {shelter}
- Community type: {type}
- Region: {region}
- Population: {population_note}

Your task is to write a clear, simple, urgent message in **{language}** that:

1. Opens with an urgent warning symbol (⚠️) and one simple sentence about what is happening
2. Tells people EXACTLY what to do: leave now / stay indoors / go to higher ground / etc.
3. Mentions the shelter name "{shelter}" specifically with directions if possible
4. Lists what to carry: children, medicines, important documents, water, food
5. Says when it is safe to return (if the alert provides timing)
6. Uses SIMPLE words that a person with {literacy} literacy can understand
7. Feels like a trusted neighbour or village elder is speaking — warm but urgent
8. Does NOT use English technical terms like "storm surge" or "astronomical tide"
9. Does NOT use formal government tone
10. Is between 80-150 words

Write ONLY the adapted message. No explanation. No English translation. No metadata.
The entire message must be in {language} script/text.
"""


def agent_adapt(extracted_facts: dict, community_profile: dict) -> str:
    """Agent 2: Rewrite extracted facts for a specific community."""
    system = ADAPT_SYSTEM_TEMPLATE.format(
        language=community_profile["language"],
        literacy=community_profile["literacy"],
        shelter=community_profile["shelter"],
        type=community_profile["type"],
        region=community_profile.get("region", "India"),
        population_note=community_profile.get("population_note", "vulnerable community")
    )
    user_msg = f"Here are the extracted facts from the disaster alert:\n{json.dumps(extracted_facts, indent=2)}"
    return call_groq(system, user_msg)


# ─────────────────────────────────────────────
# AGENT 3 — Multi-Format Output
# ─────────────────────────────────────────────
FORMAT_SYSTEM = """You are formatting a disaster alert message into three delivery formats for a vulnerable community.

Given the adapted message (already in the local language), create THREE versions:

1. **whatsapp**: Full message with relevant emojis, clear paragraphs, and line breaks. Maximum 200 words. Should feel like a WhatsApp broadcast message from a trusted community leader.

2. **sms**: Ultra-short version under 160 characters total. Include ONLY the most critical action (evacuate / stay indoors / go to shelter). Must fit in a single SMS.

3. **voice**: A script for someone to read aloud over a loudspeaker or community radio. Should be calm, clear, and repeat the most important action twice. Written in the SAME language as the input message. Include pauses indicated by "..." between sentences.

Return ONLY valid JSON with exactly these three keys: "whatsapp", "sms", "voice"
No markdown. No explanations. No extra text.
"""


def agent_format(adapted_message: str) -> dict:
    """Agent 3: Format the adapted message for WhatsApp, SMS, and Voice."""
    result = call_groq(FORMAT_SYSTEM, adapted_message)
    try:
        cleaned = result.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
        return json.loads(cleaned.strip())
    except json.JSONDecodeError:
        return {
            "whatsapp": adapted_message,
            "sms": adapted_message[:160],
            "voice": adapted_message
        }


# ─────────────────────────────────────────────
# Full Pipeline
# ─────────────────────────────────────────────
def run_pipeline(alert_text: str, community_profile: dict) -> dict:
    """Run the full 3-agent pipeline end-to-end."""
    extracted = agent_extract(alert_text)
    adapted = agent_adapt(extracted, community_profile)
    formatted = agent_format(adapted)

    return {
        "extracted": extracted,
        "adapted": adapted,
        "formatted": formatted,
    }
