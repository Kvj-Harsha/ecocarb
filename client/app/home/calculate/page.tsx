"use client";

import { useState } from "react";

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

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          speed: parseFloat(formData.speed),
          acceleration: parseFloat(formData.acceleration),
          fuel_efficiency: parseFloat(formData.fuel_efficiency),
          distance_traveled: parseFloat(formData.distance_traveled),
          road_gradient: parseFloat(formData.road_gradient),
          car_age: parseInt(formData.car_age),
          engine_size: parseFloat(formData.engine_size),
          cylinders: parseInt(formData.cylinders),
          traffic_condition: parseInt(formData.traffic_condition),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(`Predicted CO₂ Emission: ${data.predicted_emission} grams`);
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("Failed to connect to the server");
    }
  };

  return (
    <section>
      <div className="grid grid-cols-2 gap-8 p-10 min-h-screen bg-gray-50">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold">Carbon Emission Predictor</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
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
            <button type="submit" className="col-span-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Predict</button>
          </form>
        </div>
        <div className="flex items-center justify-center bg-white shadow-lg p-6 rounded-lg">
          {result ? (
            <p className="text-green-600 text-xl font-semibold">{result}</p>
          ) : error ? (
            <p className="text-red-600 text-xl font-semibold">{error}</p>
          ) : (
            <p className="text-gray-500 text-lg">Enter details to predict emissions</p>
          )}
        </div>
      </div>
    </section>
  );
}