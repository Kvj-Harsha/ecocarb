import joblib
import pandas as pd
import numpy as np

# Step 1: Load the trained model
model = joblib.load("final_model.pkl")
print("Model Loaded Successfully! 🎯")

# Step 2: Define a single input sample as a JSON object
input_json ={
    "make": "Tesla",
    "model": 2022,
    "speed": 103.81901559582536,
    "acceleration": 6.098135536828771,
    "fuel_efficiency": 11.410099592223984,
    "distance_traveled": 292.79384193630625,
    "traffic_condition": 2,
    "road_gradient": -0.5730629803256413,
    "fuel_type": "CNG",
    "car_age": 5,
    "vehicle_type": "Truck",
    "transmission": "Manual",
    "engine_size": 5.311927581044285,
    "cylinders": 6
}




# Step 3: Convert the input JSON into a pandas DataFrame
input_data = pd.DataFrame([input_json])

fuel_emission_factors = {
    "Petrol": 2.31,
    "Diesel": 2.68,
    "CNG": 2.03,
    "Electric": 0
}

# Step 4: Compute emission factors
input_data['emission_factor'] = input_data['fuel_type'].map(fuel_emission_factors)

vehicle_type_factors = {"Sedan": 1.0, "SUV": 1.2, "Truck": 1.5, "Motorcycle": 0.8}
input_data['vehicle_type_factor'] = input_data['vehicle_type'].map(vehicle_type_factors)

traffic_factors = {0: 1.0, 1: 1.2, 2: 1.5}
input_data['traffic_factor'] = input_data['traffic_condition'].map(traffic_factors)

input_data['car_age_factor'] = 1 + 0.02 * input_data['car_age']
input_data['gradient_factor'] = 1 + 0.05 * input_data['road_gradient']

# Step 5: Compute additional factors
input_data['cylinders_factor'] = 1 + (input_data['cylinders'] - 4) * 0.05
input_data['engine_size_factor'] = 1 + (input_data['engine_size'] - 1.5) * 0.1

# Step 6: One-hot encode categorical variables
input_data = pd.get_dummies(input_data, columns=["fuel_type", "vehicle_type", "make", "model", "transmission"], drop_first=True)

# Step 7: Add missing columns for one-hot encoding (columns expected by the model)
expected_columns = model.feature_names_in_
missing_cols = set(expected_columns) - set(input_data.columns)
for col in missing_cols:
    input_data[col] = 0

# Ensure the columns are in the same order as during training
input_data = input_data[expected_columns]

# Step 8: Make prediction using the trained model
predicted_emission = model.predict(input_data)

# Step 9: Output the result
print(f"Predicted Carbon Emission: {predicted_emission[0]:.4f} grams of CO₂")
