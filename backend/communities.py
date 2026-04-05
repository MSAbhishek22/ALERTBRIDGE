"""
Pre-built community profiles for AlertBridge.
Each profile describes a vulnerable community's language, literacy,
nearest shelter, and cultural context for AI-driven alert adaptation.
"""

COMMUNITIES = {
    "odisha_coastal": {
        "name": "Coastal Odisha Fishing Village",
        "language": "Odia",
        "literacy": "low — many people cannot read well, use simple words a Class 5 student understands",
        "shelter": "Gram Panchayat building at the main chowk",
        "type": "coastal fishing village",
        "emoji": "🌊",
        "region": "Odisha Coast, India",
        "population_note": "Primarily fisherfolk families, elderly, and children"
    },
    "bihar_flood": {
        "name": "Flood-prone Bihar Farming Community",
        "language": "Bhojpuri Hindi",
        "literacy": "medium — most can read basic Hindi but not English",
        "shelter": "Primary school building on the highway",
        "type": "riverine farming community near Ganga floodplain",
        "emoji": "🌾",
        "region": "North Bihar, India",
        "population_note": "Smallholder farmers, daily wage workers, large families"
    },
    "tamil_coastal": {
        "name": "Coastal Tamil Nadu Fishing Town",
        "language": "Tamil",
        "literacy": "medium — can read Tamil but not English technical terms",
        "shelter": "Government Higher Secondary School, Main Road",
        "type": "coastal fishing town with boat harbours",
        "emoji": "🐟",
        "region": "Tamil Nadu Coast, India",
        "population_note": "Fishing families, fish market workers, migrant labourers"
    },
    "kerala_highland": {
        "name": "Kerala Highland Farming Community",
        "language": "Malayalam",
        "literacy": "high — most are literate but unfamiliar with meteorological jargon",
        "shelter": "Panchayat Community Hall near the temple",
        "type": "highland plantation and farming community prone to landslides",
        "emoji": "🏔️",
        "region": "Western Ghats, Kerala, India",
        "population_note": "Tea/spice plantation workers, tribal communities"
    },
    "bengal_coastal": {
        "name": "Coastal West Bengal (Sundarbans)",
        "language": "Bengali",
        "literacy": "low — many rely on oral communication",
        "shelter": "Cyclone shelter centre near the embankment",
        "type": "coastal island community in the Sundarbans delta",
        "emoji": "🌿",
        "region": "Sundarbans, West Bengal, India",
        "population_note": "Honey collectors, crab catchers, small-scale fishers"
    }
}
