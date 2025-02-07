"use client";

import ANavbar from "@/app/components/Anavbar";
import { useState, useEffect } from "react";
import { SiTransmission } from "react-icons/si";

export default function CarbonEmissionSimulator() {
  const [formData, setFormData] = useState({
    speed: 0,
    acceleration: 0,
    fuel_efficiency: 10,
    distance_traveled: 0,
    fuel_type: "Diesel",
    car_age: 5,
    road_gradient: 0,
    vehicle_type: "Sedan",
    traffic_condition: 0,
    cylinders: 0,
    engine_size: 3,
    make: "BMW",
    model: 2022,
    transmission: "Manual",
  });
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: number | string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePredict = async () => {
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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

  useEffect(() => {
    handlePredict();
  }, [formData.speed, formData.acceleration]);

  return (
    <section className="min-h-screen bg-gray-100 flex flex-col">
      <ANavbar />
      <div className="flex flex-col items-center p-10 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Carbon Emission Simulator</h1>
        <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-4xl">
          <div className="flex justify-center gap-6 mb-6">
            <button
              onClick={() => handleChange("speed", formData.speed + 5)}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow"
            >
              Accelerate
            </button>
            <button
              onClick={() => handleChange("speed", Math.max(0, formData.speed - 5))}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow"
            >
              Brake
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(formData).map((key) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">{key.replace("_", " ").toUpperCase()}</label>
                <input
                  type={typeof formData[key] === "number" ? "number" : "text"}
                  value={formData[key]}
                  onChange={(e) => handleChange(key, typeof formData[key] === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
                  className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 bg-white shadow-lg p-6 rounded-lg w-full max-w-3xl text-center">
          {result ? (
            <p className="text-green-600 text-xl font-semibold">{result}</p>
          ) : error ? (
            <p className="text-red-600 text-xl font-semibold">{error}</p>
          ) : (
            <p className="text-gray-500 text-lg">Adjust values to predict emissions</p>
          )}
        </div>
      </div>
    </section>
  );
}
