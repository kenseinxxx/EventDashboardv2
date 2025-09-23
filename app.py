from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # <-- enable CORS for all routes

@app.route('/save-dashboard', methods=['POST'])
def save_dashboard():
    data = request.json
    print("Received data:", data)

    with open("dashboard_data.json", "w") as f:
        json.dump(data, f, indent=4)

    return jsonify({"status": "success", "message": "Dashboard saved successfully"}), 200

if __name__ == "__main__":
    app.run(debug=True)
