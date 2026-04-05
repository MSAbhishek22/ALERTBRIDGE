"""
AlertBridge — Flask Backend
Exposes the /process endpoint for the 3-agent disaster alert pipeline.
"""

from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS
from agents import run_pipeline
from communities import COMMUNITIES

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "AlertBridge API"})


@app.route("/communities", methods=["GET"])
def get_communities():
    """Return available community profiles."""
    result = {}
    for key, profile in COMMUNITIES.items():
        result[key] = {
            "name": profile["name"],
            "language": profile["language"],
            "emoji": profile["emoji"],
            "region": profile["region"],
            "type": profile["type"],
            "shelter": profile["shelter"],
        }
    return jsonify(result)


@app.route("/process", methods=["POST"])
def process_alert():
    """
    Process a raw disaster alert through the 3-agent pipeline.
    
    Expects JSON body:
    {
        "alert_text": "raw government alert text",
        "community": "odisha_coastal"  (key from COMMUNITIES)
    }
    """
    data = request.json
    if not data:
        return jsonify({"error": "No JSON body provided"}), 400

    alert_text = data.get("alert_text", "").strip()
    community_key = data.get("community", "odisha_coastal")

    if not alert_text:
        return jsonify({"error": "alert_text is required"}), 400

    profile = COMMUNITIES.get(community_key)
    if not profile:
        return jsonify({"error": f"Unknown community: {community_key}. Available: {list(COMMUNITIES.keys())}"}), 400

    try:
        result = run_pipeline(alert_text, profile)
        return jsonify({
            "success": True,
            "original": alert_text,
            "community": {
                "key": community_key,
                **profile
            },
            **result
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")
