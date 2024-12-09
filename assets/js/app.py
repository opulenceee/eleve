from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests for testing

# Load webhooks from environment variables
MODEL_WEBHOOK_URL = os.getenv("MODEL_WEBHOOK_URL")
CLIENT_WEBHOOK_URL = os.getenv("CLIENT_WEBHOOK_URL")

# Directory for saving submissions
SUBMISSIONS_DIR = "submissions"
os.makedirs(SUBMISSIONS_DIR, exist_ok=True)

@app.route('/submit-form', methods=['POST'])
def submit_form():
    try:
        data = request.json
        user_type = data.get("userType", "").capitalize()  # Get userType and ensure it's capitalized

        # Ensure we have a valid userType
        if user_type not in ["Client", "Model"]:
            return jsonify({"message": "Invalid user type."}), 400
        
        # Prepare the file name and save the data
        name = data.get("name", "unknown").replace(" ", "_")
        file_path = os.path.join(SUBMISSIONS_DIR, f"{name}.json")

        # Save data to a JSON file
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)

        # Select the appropriate webhook based on userType
        if user_type == "Client":
            webhook_url = CLIENT_WEBHOOK_URL

            # Filter the data to only include client-specific fields
            client_data = {
                "Name": data.get("name", "N/A"),
                "Company Name": data.get("company", "N/A"),
                "Phone": data.get("phone", "N/A"),
            }

            discord_embed = {
                "embeds": [
                    {
                        "title": f"New {user_type} Form Submission",
                        "fields": [{"name": key, "value": str(value) or "N/A", "inline": False} for key, value in client_data.items()],
                        "color": 5814783,
                        "timestamp": datetime.utcnow().isoformat(),
                    }
                ]
            }

        else:  # If it's a model, include all fields
            webhook_url = MODEL_WEBHOOK_URL

            # Prepare the Discord embed with all the fields
            discord_embed = {
                "embeds": [
                    {
                        "title": f"New {user_type} Form Submission",
                        "fields": [{"name": key, "value": str(value) or "N/A", "inline": True} for key, value in data.items()],
                        "color": 5814783,
                        "timestamp": datetime.utcnow().isoformat(),
                    }
                ]
            }

        # Send the data to the corresponding Discord webhook
        response = requests.post(webhook_url, json=discord_embed)
        if response.status_code != 204:
            return jsonify({"message": "Failed to notify Discord"}), 500

        return jsonify({"message": f"{user_type} form submitted successfully!"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "An error occurred."}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
