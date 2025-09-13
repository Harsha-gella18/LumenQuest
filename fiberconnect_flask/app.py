from flask import Flask, request, jsonify
import pandas as pd
import joblib
from datetime import datetime

app = Flask(__name__)

# Load model once when the server starts
model = joblib.load("best_model.pkl")

# Load subscription data
subs = pd.read_csv("data/Subscriptions.csv")

@app.route('/')
def home():
    return "📺 FiberConnect TV - ML Plan Recommendation API is running!"

@app.route('/recommend', methods=['POST'])
def recommend():
    """
    Expects JSON with:
    {
        "user_id": 123
    }
    """
    data = request.get_json()
    
    if not data or "user_id" not in data:
        return jsonify({"error": "Missing 'user_id' in request"}), 400

    user_id = data["user_id"]

    # Get first subscription of this user
    user_sub = subs[subs["User Id"] == user_id].head(1)

    if user_sub.empty:
        # Default plan for users without subscriptions
        return jsonify({
            "user_id": user_id,
            "recommended_plan": "Basic Hindi Pack",
            "message": "No subscription history found."
        })

    # Calculate features
    duration_days = (
        pd.to_datetime(user_sub["Last Renewed Date"], errors="coerce") -
        pd.to_datetime(user_sub["Start Date"], errors="coerce")
    ).dt.days.values[0]

    grace = user_sub["Grace Time"].values[0]

    # Prepare features as DataFrame
    X_new = pd.DataFrame([[duration_days if pd.notnull(duration_days) else 0, grace]],
                         columns=["duration_days", "Grace Time"])
    
    # Make prediction
    prediction = model.predict(X_new)[0]
    plan = "Sports Pack" if prediction == 1 else "Movies Pack"

    return jsonify({
        "user_id": user_id,
        "recommended_plan": plan,
        "features": {
            "duration_days": int(duration_days),
            "grace_time": int(grace)
        }
    })

if __name__ == "__main__":
    app.run(debug=True)
