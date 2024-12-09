from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import requests
from datetime import datetime, timezone
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

MODEL_WEBHOOK_URL = os.getenv("MODEL_WEBHOOK_URL")
CLIENT_WEBHOOK_URL = os.getenv("CLIENT_WEBHOOK_URL")
CONTRACT_WEBHOOK_URL = os.getenv("CONTRACT_WEBHOOK_URL")

UPLOAD_FOLDER = 'uploads'
SUBMISSIONS_DIR = "submissions"
CONTRACTS_DIR = "contracts"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

for dir in [UPLOAD_FOLDER, SUBMISSIONS_DIR, CONTRACTS_DIR]:
    os.makedirs(dir, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def format_model_embed(data):
    return {
        "embeds": [{
            "title": "🎭 New Model Application",
            "description": "A new model has submitted an application!",
            "color": 38655,
            "fields": [
                {"name": "Name", "value": data.get("name", "N/A"), "inline": True},
                {"name": "Age", "value": data.get("age", "N/A"), "inline": True},
                {"name": "Phone", "value": data.get("phone", "N/A"), "inline": True},
                {"name": "Work Type", "value": data.get("workType", "N/A"), "inline": True},
                {"name": "Facebrowser", "value": data.get("facebrowser", "N/A"), "inline": True},
                {"name": "Measurements", "value": data.get("measurements", "N/A"), "inline": True}
            ],
            "footer": {"text": "Elevé Model Management"},
            "timestamp": datetime.now(timezone.utc).isoformat()
        }]
    }

def format_client_embed(data):
    return {
        "embeds": [{
            "title": "💼 New Client Inquiry",
            "description": "A potential client has reached out!",
            "color": 38655,
            "fields": [
                {"name": "Name", "value": data.get("name", "N/A"), "inline": True},
                {"name": "Company", "value": data.get("company", "N/A"), "inline": True},
                {"name": "Phone", "value": data.get("phone", "N/A"), "inline": True}
            ],
            "footer": {"text": "Elevé Model Management"},
            "timestamp": datetime.now(timezone.utc).isoformat()
        }]
    }

def format_contract_embed(data):
    return {
        "embeds": [{
            "title": "📝 Contract Signed",
            "description": "A model has signed their contract!",
            "color": 38655,
            "fields": [
                {"name": "Model Name", "value": data.get("name", "N/A"), "inline": True},
                {"name": "Date Signed", "value": data.get("dateSigned", "N/A"), "inline": True},
                {"name": "Username", "value": data.get("username", "N/A"), "inline": True}
            ],
            "footer": {"text": "Elevé Model Management"},
            "timestamp": datetime.now(timezone.utc).isoformat()
        }]
    }

@app.route('/submit-form', methods=['POST'])
def submit_form():
    try:
        data = request.json
        submission_type = data.get("submissionType", "")
        timestamp = datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')

        if submission_type == "Contract":
            username = secure_filename(data.get("username", "unknown"))
            file_path = os.path.join(CONTRACTS_DIR, f"{username}_contract_{timestamp}.json")
            webhook_url = CONTRACT_WEBHOOK_URL
            embed = format_contract_embed(data)
        else:
            user_type = data.get("userType", "").capitalize()
            if user_type not in ["Client", "Model"]:
                return jsonify({"message": "Invalid user type specified."}), 400
                
            name = secure_filename(data.get("name", "unknown"))
            file_path = os.path.join(SUBMISSIONS_DIR, f"{name}_{timestamp}.json")
            webhook_url = MODEL_WEBHOOK_URL if user_type == "Model" else CLIENT_WEBHOOK_URL
            embed = format_model_embed(data) if user_type == "Model" else format_client_embed(data)

        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)

        response = requests.post(webhook_url, json=embed)
        
        if response.status_code == 204:
            message = "Contract signed successfully!" if submission_type == "Contract" else "Form submitted successfully!"
            return jsonify({"message": message, "status": "success"}), 200
        else:
            print(f"Discord webhook error: {response.status_code} - {response.text}")
            return jsonify({"message": "Submission saved but notification failed.", "status": "partial_success"}), 207

    except Exception as e:
        print(f"Error processing submission: {str(e)}")
        return jsonify({
            "message": "An error occurred while processing your submission.",
            "status": "error",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)