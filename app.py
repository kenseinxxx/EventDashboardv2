from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # enable CORS for all routes

def deep_update(orig, updates):
    """Recursively update dicts without overwriting missing data."""
    for key, value in updates.items():
        if isinstance(value, dict) and isinstance(orig.get(key), dict):
            deep_update(orig[key], value)
        else:
            orig[key] = value
    return orig


def save_json(file_name, new_data):
    """Helper to load, merge, and save JSON safely."""
    if os.path.exists(file_name):
        with open(file_name, "r") as f:
            try:
                existing = json.load(f)
            except json.JSONDecodeError:
                existing = {}
    else:
        existing = {}

    merged = deep_update(existing, new_data)

    with open(file_name, "w") as f:
        json.dump(merged, f, indent=4)

    return merged


# Route for dashboard_data.json
@app.route('/save-dashboard', methods=['POST'])
def save_dashboard():
    new_data = request.json
    merged = save_json("dashboard_data.json", new_data)
    return jsonify({"status": "success", "message": "Dashboard updated successfully", "data": merged}), 200


# Route for PAGData.json
@app.route('/save-pag', methods=['POST'])
def save_pag():
    new_data = request.json
    merged = save_json("PAGData.json", new_data)
    return jsonify({"status": "success", "message": "Program at a Glance updated successfully", "data": merged}), 200


if __name__ == "__main__":
    app.run(debug=True)
