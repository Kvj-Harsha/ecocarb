import joblib
import pandas as pd
import numpy as np

# Step 1: Load the trained model
model = joblib.load("model.pkl")
print("Model Loaded Successfully! 🎯")

# Step 2: Define a single input sample as a JSON object
input_json = {
    "fuel_efficiency": 6.878762521094965,  # in L/100km
    "distance_traveled":339.62446716236,  # in km
    "traffic_condition": 1,  # 0 = free, 1 = moderate, 2 = heavy
    "road_gradient": 2.093888218243862,  # in degrees
    "fuel_type": "Diesel",
    "car_age":13,  # in years
    "vehicle_type": "Sedan",
    "speed": 51.199413073209875,  # in km/h
    "acceleration": -1.8892024269682821  # in m/s²
}

# input_json = {
#     "fuel_efficiency": 7,  # in L/100km
#     "distance_traveled":339,  # in km
#     "traffic_condition": 1,  # 0 = free, 1 = moderate, 2 = heavy
#     "road_gradient": 2,  # in degrees
#     "fuel_type": "Diesel",
#     "car_age":13,  # in years
#     "vehicle_type": "Sedan",
#     "speed": 51,  # in km/h
#     "acceleration": -1  # in m/s²
# }


# Step 3: Convert the input JSON into a pandas DataFrame
input_data = pd.DataFrame([input_json])

fuel_emission_factors = {
    "Petrol": 2.31,  # gCO₂ per liter of petrol
    "Diesel": 2.68,  # gCO₂ per liter of diesel
    "CNG": 2.03,     # gCO₂ per liter of CNG
    "Electric": 0    # Electric vehicles have zero direct emissions
}
# Step 6: Add calculated features (e.g., emission_factor, car_age_factor, etc.)
input_data['emission_factor'] = input_data['fuel_type'].map(fuel_emission_factors)  # Example emission factor for Petrol
vehicle_type_factors = {"Sedan": 1.0, "SUV": 1.2, "Truck": 1.5, "Motorcycle": 0.8}
input_data['vehicle_type_factor'] =input_data['vehicle_type'].map(vehicle_type_factors) 
# Step 4: One-hot encode categorical variables
input_data = pd.get_dummies(input_data, columns=["fuel_type", "vehicle_type"], drop_first=True)

# Step 5: Add missing columns for one-hot encoding (columns expected by the model)
expected_columns = model.feature_names_in_

# Add missing columns with 0 values (for unseen categories)
missing_cols = set(expected_columns) - set(input_data.columns)
for col in missing_cols:
    input_data[col] = 0

# Ensure the columns are in the same order as during training
input_data = input_data[expected_columns]

input_data['car_age_factor'] =  1 + 0.02 * input_data['car_age'] 


traffic_factors = {0: 1.0, 1: 1.2, 2: 1.5}  # Free, moderate, heavy traffic

input_data['traffic_factor'] =input_data['traffic_condition'].map(traffic_factors)
input_data['gradient_factor'] = 1 + 0.05 * input_data['road_gradient'] 

# Step 7: Make prediction using the trained model
predicted_emission = model.predict(input_data)

# Step 8: Output the result
print(f"Predicted Carbon Emission: {predicted_emission[0]:.4f} grams of CO₂")
