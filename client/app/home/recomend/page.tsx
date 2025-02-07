"use client";
import { useState } from "react";
import { chatSession } from "@/app/service/AIModal";

export default function CarbonEmission() {
  const [formData, setFormData] = useState({
    make: "Tesla",
    model: "2022",
    speed: "",
    acceleration: "",
    fuel_efficiency: "",
    distance_traveled: "",
    traffic_condition: "1",
    road_gradient: "",
    fuel_type: "Diesel",
    car_age: "",
    vehicle_type: "Sedan",
    transmission: "Manual",
    engine_size: "",
    cylinders: ""
  });

  const [result2, setResult2] = useState<{ immediate_action: string; tip1: string; tip2: string } | null>(null);
  const [error3, setError3] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError3(null);
    setResult2(null);

    if (
      !formData.speed ||
      !formData.acceleration ||
      !formData.fuel_efficiency ||
      !formData.distance_traveled ||
      !formData.road_gradient ||
      !formData.car_age ||
      !formData.engine_size ||
      !formData.cylinders
    ) {
      setError3("Please fill in all required fields.");
      return;
    }

    try {
      const emissionPrompt = `
      Given the following vehicle parameters, predict the CO2 emissions and provide driving recommendations:
      
      Vehicle Details:
      - Make: ${formData.make}
      - Model Year: ${formData.model}
      - Speed: ${formData.speed} km/h
      - Acceleration: ${formData.acceleration} m/s²
      - Fuel Efficiency: ${formData.fuel_efficiency} L/100km
      - Distance Traveled: ${formData.distance_traveled} km
      - Traffic Condition: ${formData.traffic_condition} (1: Light traffic, 5: Heavy traffic)
      - Road Gradient: ${formData.road_gradient}°
      - Fuel Type: ${formData.fuel_type}
      - Car Age: ${formData.car_age} years
      - Vehicle Type: ${formData.vehicle_type}
      - Transmission: ${formData.transmission}
      - Engine Size: ${formData.engine_size} L
      - Cylinders: ${formData.cylinders}
      
      Expected Output:
      {
        "immediate_action": "Your immediate action here",
        "tip1": "First driving tip here",
        "tip2": "Second driving tip here"
      }
      Return the response strictly in JSON format.
      `;

      const geminiResult2 = await chatSession.sendMessage(emissionPrompt);
      const responseText = geminiResult2?.response?.text();

      if (responseText) {
        const parsedResult2 = JSON.parse(responseText);
        setResult2(parsedResult2);
      } else {
        setError3("Failed to get prediction from Gemini.");
      }
    } catch (err) {
      console.error("Error3:", err);
      setError3("Failed to connect to the server or Gemini API");
    }
  };

  return (
    <section>
      <div className="gap-8 p-10 min-h-screen bg-gray-50">
        
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold">Carbon Emission Predictor</h1>
         

        <form onSubmit={handleSubmit2} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="make" value={formData.make} onChange={handleChange} className="p-2 border rounded">
              {["BMW", "Chevrolet", "Ford", "Honda", "Mercedes", "Tesla", "Toyota"].map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
            </select>
            <select name="model" value={formData.model} onChange={handleChange} className="p-2 border rounded">
              {Array.from({ length: 25 }, (_, i) => 2000 + i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
            </select>
            <input type="number" name="speed" placeholder="Speed (km/h)" required onChange={handleChange} className="p-2 border rounded" />
            <input type="number" name="acceleration" placeholder="Acceleration (m/s²)" required onChange={handleChange} className="p-2 border rounded" />
            <input type="number" name="fuel_efficiency" placeholder="Fuel Efficiency (L/100km)" required onChange={handleChange} className="p-2 border rounded" />
            <input type="number" name="distance_traveled" placeholder="Distance (km)" required onChange={handleChange} className="p-2 border rounded" />
            <input type="number" name="road_gradient" placeholder="Road Gradient (°)" required onChange={handleChange} className="p-2 border rounded" />
            <input type="number" name="car_age" placeholder="Car Age (years)" required onChange={handleChange} className="p-2 border rounded" />
            <input type="number" name="engine_size" placeholder="Engine Size (L)" required onChange={handleChange} className="p-2 border rounded" />
            <input type="number" name="cylinders" placeholder="Cylinders" required onChange={handleChange} className="p-2 border rounded" />
            <select name="fuel_type" onChange={handleChange} className="p-2 border rounded">
              {["Diesel", "Petrol", "CNG", "Electric"].map((fuel) => (
                  <option key={fuel} value={fuel}>{fuel}</option>
                ))}
            </select>
            <select name="vehicle_type" onChange={handleChange} className="p-2 border rounded">
              {["Sedan", "SUV", "Truck", "Hatchback"].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
            </select>
            <select name="transmission" onChange={handleChange} className="p-2 border rounded">
              {["Manual", "Automatic"].map((transmission) => (
                <option key={transmission} value={transmission}>{transmission}</option>
            ))}
            </select>

            {/* Traffic Condition (1-5) */}
            <select name="traffic_condition" onChange={handleChange} className="p-2 border rounded">
              {Array.from({ length: 5 }, (_, i) => i + 1).map((condition) => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
            </select>
            <button type="submit" className="col-span-1 md:col-span-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Predict</button>
          </form>

        </div>


        <div className="flex items-center justify-center bg-white shadow-lg p-6 rounded-lg">
          {result2 ? (
              <div>
              <h2 className="text-xl font-semibold">Immediate Action:</h2>
              <p className="text-green-600">{result2.immediate_action}</p>
              <h2 className="text-xl font-semibold mt-4">Tips:</h2>
              <p className="text-blue-600">1. {result2.tip1}</p>
              <p className="text-blue-600">2. {result2.tip2}</p>
            </div>
          ) : error3 ? (
            <p className="text-red-600 text-xl font-semibold">{error3}</p>
          ) : (
            <p className="text-gray-500 text-lg">Enter details to predict emissions</p>
          )}
        </div>

        
      </div>
    </section>
  );
}
