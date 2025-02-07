import joblib
import pandas as pd
import numpy as np

# Load both models
clf = joblib.load("model2.pkl")  # Model 2: Harsh Driving Detector
emission_model = joblib.load("gbr_carbon_emission_model_with_updated_factors_230_new.pkl")  # Model 1: Carbon Emission Estimator

# Input JSON
input_json = {
    "make": "Tesla",
    "model": 2022,
    "speed": 90,  # in km/h (high speed)
    "acceleration": 4.0,  # in m/s² (high acceleration)
    "road_gradient": 5.0,  # in degrees
    "traffic_condition": 2,  # heavy traffic
    "fuel_efficiency": 12.0,  # in km/l
    "distance_traveled": 100,  # in km
    "fuel_type": "Diesel",
    "car_age": 5,  # in years
    "vehicle_type": "SUV",
    "transmission": "Manual",
    "engine_size": 5.311927581044285,
    "cylinders": 6
}

# Step 1: Convert input JSON to DataFrame
input_data = pd.DataFrame([input_json])

# Step 2: Check if the vehicle is electric
if input_data["fuel_type"].iloc[0] == "Electric":
    print("⚡ Electric Vehicle Detected - Harsh driving detection is not required.")
    print("✅ No Carbon Emissions for Electric Vehicles.")
else:
    # Calculate emission factors and other derived factors
    fuel_emission_factors = {
        "Petrol": 2.31,
        "Diesel": 2.68,
        "CNG": 2.03,
        "Electric": 0
    }
    
    input_data['emission_factor'] = input_data['fuel_type'].map(fuel_emission_factors)

    vehicle_type_factors = {"Sedan": 1.0, "SUV": 1.2, "Truck": 1.5, "Motorcycle": 0.8}
    input_data['vehicle_type_factor'] = input_data['vehicle_type'].map(vehicle_type_factors)

    traffic_factors = {0: 1.0, 1: 1.2, 2: 1.5}
    input_data['traffic_factor'] = input_data['traffic_condition'].map(traffic_factors)

    input_data['car_age_factor'] = 1 + 0.02 * input_data['car_age']
    input_data['gradient_factor'] = 1 + 0.05 * input_data['road_gradient']

    input_data['cylinders_factor'] = 1 + (input_data['cylinders'] - 4) * 0.05
    input_data['engine_size_factor'] = 1 + (input_data['engine_size'] - 1.5) * 0.1

    # One-hot encode categorical variables
    input_data = pd.get_dummies(input_data, columns=["fuel_type", "vehicle_type", "make", "model", "transmission"], drop_first=True)

    # Add missing columns for one-hot encoding
    expected_columns = emission_model.feature_names_in_
    missing_cols = set(expected_columns) - set(input_data.columns)
    for col in missing_cols:
        input_data[col] = 0

    # Ensure the columns are in the correct order
    input_data = input_data[expected_columns]

    # Step 3: Predict Harsh Driving
    prediction = clf.predict(input_data[['speed', 'acceleration', 'road_gradient', 'traffic_condition']])[0]

    if prediction == 1:
        print("🚨 Harsh Driving Detected!")

        # Step 4: Predict Emission Under Harsh Conditions
        harsh_emission = emission_model.predict(input_data)[0]

        # Step 5: Adjust for normal conditions (reduce acceleration and speed)
        normal_input = input_json.copy()
        normal_input["speed"] = min(60, normal_input["speed"])  # Reduce speed to a safer value
        normal_input["acceleration"] = np.clip(normal_input["acceleration"], -2, 2)  # Limit acceleration
        normal_input = pd.DataFrame([normal_input])

        # Recompute derived factors
        normal_input['emission_factor'] = normal_input['fuel_type'].map(fuel_emission_factors)
        normal_input['vehicle_type_factor'] = normal_input['vehicle_type'].map(vehicle_type_factors)
        normal_input['traffic_factor'] = normal_input['traffic_condition'].map(traffic_factors)
        normal_input['car_age_factor'] = 1 + 0.02 * normal_input['car_age']
        normal_input['gradient_factor'] = 1 + 0.05 * normal_input['road_gradient']
        normal_input['cylinders_factor'] = 1 + (normal_input['cylinders'] - 4) * 0.05
        normal_input['engine_size_factor'] = 1 + (normal_input['engine_size'] - 1.5) * 0.1

        # One-hot encode categorical variables
        normal_input = pd.get_dummies(normal_input, columns=["fuel_type", "vehicle_type", "make", "model", "transmission"], drop_first=True)

        # Add missing columns
        for col in missing_cols:
            normal_input[col] = 0
        normal_input = normal_input[expected_columns]

        # Step 6: Calculate emission for normal driving
        normal_emission = emission_model.predict(normal_input)[0]

        # Step 7: Calculate extra emissions due to harsh driving
        extra_emission = harsh_emission - normal_emission
        print(f"Harsh Emission: {harsh_emission:.4f} grams of CO₂")
        print(f"Normal Emission: {normal_emission:.4f} grams of CO₂")
        print(f"Extra Carbon Emission Due to Harsh Driving: {extra_emission:.4f} grams of CO₂")
    else:
        print("✅ Normal Driving")