"use client";

import { useState, useEffect, useRef } from "react";
import { FaCar, FaClock, FaCloud } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function CarbonEmissionSimulator() {
  // Form state with simulation parameters
  const [formData, setFormData] = useState<Record<string, number | string>>({
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

  // Simulation data: speed, acceleration, distance over time
  const [simData, setSimData] = useState<
    { time: string; speed: number; acceleration: number; distance: number }[]
  >([]);
  // Emission graph data from API predictions over time
  const [emissionGraphData, setEmissionGraphData] = useState<
    { time: string; emission: number }[]
  >([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle changes to the form fields
  const handleChange = (field: string, value: number | string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Call the API to predict CO₂ emission and update the emission graph
  const handlePredict = async () => {
    setError(null);
    setResult(null);
    if (formData.distance_traveled === 0 || formData.fuel_type === "Electric") {
      setResult("Predicted CO₂ Emission: 0 grams");
      setEmissionGraphData((prev) => [...prev, { time: new Date().toLocaleTimeString(), emission: 0 }]);
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
        setEmissionGraphData((prev) => [
          ...prev,
          { time: new Date().toLocaleTimeString(), emission: data.predicted_emission },
        ]);
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("Failed to connect to the server");
    }
  };

  // Start simulation: update simulation parameters and push new data points
  const startTrip = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setFormData((prev) => {
        if ((prev.speed as number) >= 220) {
          clearInterval(intervalRef.current!);
          return prev;
        }
        const newAcceleration = (prev.acceleration as number) + 0.02;
        const newSpeed = (prev.speed as number) + newAcceleration;
        const newDistance = (prev.distance_traveled as number) + (newSpeed / 3600) * 1000;
        // Update simulation graph data
        setSimData((prevSim) => [
          ...prevSim,
          { time: new Date().toLocaleTimeString(), speed: newSpeed, acceleration: newAcceleration, distance: newDistance },
        ]);
        return { ...prev, acceleration: newAcceleration, speed: newSpeed, distance_traveled: newDistance };
      });
    }, 5000);
  };

  const stopTrip = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Whenever formData changes, update the predicted emission (and its graph) by calling the API
  useEffect(() => {
    handlePredict();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.speed, formData.acceleration, formData.distance_traveled, formData.fuel_type]);

  return (
    <section className="min-h-screen bg-gray-100 p-6 flex flex-col gap-6">
      {/* Top row: left side (form) & right side (predicted CO₂ emission) */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side: Form & Simulation Controls */}
        <div className="w-full md:w-1/2 bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2 mb-4">
            <FaCar /> Simulation Parameters
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {Object.keys(formData).map((key) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">{key.replace("_", " ").toUpperCase()}</label>
                {key === "fuel_type" || key === "vehicle_type" ? (
                  <select
                    value={formData[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
                  >
                    {key === "fuel_type" ? (
                      <>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="CNG">CNG</option>
                        <option value="Electric">Electric</option>
                      </>
                    ) : (
                      <>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Truck">Truck</option>
                        <option value="Motorcycle">Motorcycle</option>
                      </>
                    )}
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
          </div>
          <div className="mt-6 flex gap-4">
            <button
              onClick={isRunning ? stopTrip : startTrip}
              className={`px-5 py-3 rounded-lg shadow-lg text-white text-lg font-semibold transition ${
                isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              <FaClock className="mr-2" /> {isRunning ? "Stop Trip" : "Start Trip"}
            </button>
          </div>
        </div>
        {/* Right Side: Predicted CO₂ Emission & Emission Graph */}
        <div className="w-full md:w-1/2 bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Predicted CO₂ Emission</h2>
          <div className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
            <FaCloud /> {result || "CO₂ Emission: -- grams"}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={emissionGraphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis label={{ value: "Emission (g)", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Line type="monotone" dataKey="emission" stroke="#ff0000" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Bottom Section: Simulation Parameters Graph */}
      <div className="w-full bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Simulation Parameters Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={simData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis
              yAxisId="left"
              label={{ value: "Speed/Accel", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: "Distance (m)", angle: 90, position: "insideRight" }}
            />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="speed"
              stroke="#8884d8"
              strokeWidth={2}
              name="Speed (km/h)"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="acceleration"
              stroke="#82ca9d"
              strokeWidth={2}
              name="Acceleration (m/s²)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="distance"
              stroke="#ffc658"
              strokeWidth={2}
              name="Distance (m)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
