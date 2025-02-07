"use client";

import ANavbar from "@/app/components/Anavbar";
import { useState, useEffect, useRef } from "react";

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
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (field: string, value: number | string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePredict = async () => {
    setError(null);
    setResult(null);

    if (formData.distance_traveled === 0 || formData.fuel_type === "Electric") {
      setResult("Predicted CO₂ Emission: 0 grams");
      return;
    }

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

  const startTrip = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setFormData((prev) => {
        const newAcceleration = prev.acceleration + 0.5;
        const newSpeed = prev.speed + newAcceleration;
        const newDistance = prev.distance_traveled + newSpeed * 5; // distance = speed * time (5 sec)
        return {
          ...prev,
          acceleration: newAcceleration,
          speed: newSpeed,
          distance_traveled: newDistance,
        };
      });
    }, 5000);
  };

  const stopTrip = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    handlePredict();
  }, [formData.speed, formData.acceleration, formData.distance_traveled, formData.fuel_type]);

  return (
    <section className="min-h-screen bg-gray-100 flex">
      <ANavbar />
      <div className="flex flex-col w-1/3 p-6 bg-white shadow-lg">
        <h2 className="text-xl font-bold mb-4">Simulation Parameters</h2>
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col mb-2">
            <label className="text-sm font-medium text-gray-700">{key.replace("_", " ").toUpperCase()}</label>
            {key === "fuel_type" ? (
              <select
                value={formData[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
              </select>
            ) : key === "vehicle_type" ? (
              <select
                value={formData[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Motorcycle">Motorcycle</option>
              </select>
            ) : (
              <input
                type={typeof formData[key] === "number" ? "number" : "text"}
                value={formData[key]}
                onChange={(e) =>
                  handleChange(key, typeof formData[key] === "number" ? parseFloat(e.target.value) || 0 : e.target.value)
                }
                className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            )}
          </div>
        ))}
        <button
          onClick={isRunning ? stopTrip : startTrip}
          className={`mt-4 px-5 py-2 rounded-lg shadow ${isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white`}
        >
          {isRunning ? "Stop Trip" : "Start Trip"}
        </button>
      </div>
      <div className="flex flex-col items-center p-10 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Carbon Emission Simulator</h1>
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