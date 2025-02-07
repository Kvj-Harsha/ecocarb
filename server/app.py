from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
model = joblib.load("final_model.pkl")
print("Model Loaded Successfully! 🎯")

# Define emission factors
fuel_emission_factors = {"Petrol": 2.31, "Diesel": 2.68, "CNG": 2.03, "Electric": 0}
vehicle_type_factors = {"Sedan": 1.0, "SUV": 1.2, "Truck": 1.5, "Motorcycle": 0.8}
traffic_factors = {0: 1.0, 1: 1.2, 2: 1.5}

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        input_data = pd.DataFrame([data])

        # Compute factors
        input_data['emission_factor'] = input_data['fuel_type'].map(fuel_emission_factors)
        input_data['vehicle_type_factor'] = input_data['vehicle_type'].map(vehicle_type_factors)
        input_data['traffic_factor'] = input_data['traffic_condition'].map(traffic_factors)
        input_data['car_age_factor'] = 1 + 0.02 * input_data['car_age']
        input_data['gradient_factor'] = 1 + 0.05 * input_data['road_gradient']
        input_data['cylinders_factor'] = 1 + (input_data['cylinders'] - 4) * 0.05
        input_data['engine_size_factor'] = 1 + (input_data['engine_size'] - 1.5) * 0.1

        # One-hot encode categorical variables
        input_data = pd.get_dummies(input_data, columns=["fuel_type", "vehicle_type", "make", "model", "transmission"], drop_first=True)

        # Add missing columns
        expected_columns = model.feature_names_in_
        for col in expected_columns:
            if col not in input_data:
                input_data[col] = 0

        input_data = input_data[expected_columns]  # Ensure column order

        # Predict
        predicted_emission = model.predict(input_data)[0]

        return jsonify({"predicted_emission": round(predicted_emission, 4)})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
