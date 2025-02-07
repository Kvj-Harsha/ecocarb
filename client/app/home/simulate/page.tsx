"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaCar, FaGasPump, FaRoad, FaClock, FaCloud } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import ANavbar from "@/app/components/Anavbar";

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
  const [graphData, setGraphData] = useState([]);
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
        if (prev.speed >= 220) {
          clearInterval(intervalRef.current!);
          return prev;
        }
        const newAcceleration = prev.acceleration + 0.02;
        const newSpeed = prev.speed + newAcceleration;
        const newDistance = prev.distance_traveled + (newSpeed / 3600) * 1000;

        setGraphData((data) => [...data, { time: new Date().toLocaleTimeString(), speed: newSpeed, acceleration: newAcceleration, distance: newDistance }]);

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

  useEffect(() => {
    handlePredict();
  }, [formData.speed, formData.acceleration, formData.distance_traveled, formData.fuel_type]);

  return (
    <section className="min-h-screen bg-gray-100 p-6 flex flex-col gap-6">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaCar /> Simulation Parameters
        </h2>
        <motion.div className="text-2xl font-bold text-green-600 flex items-center gap-2" whileHover={{ scale: 1.1 }}>
          <FaCloud /> {result || "CO₂ Emission: -- grams"}
        </motion.div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(formData).map((key) => (
          <motion.div key={key} className="flex flex-col" whileHover={{ scale: 1.05 }}>
            <label className="text-sm font-medium text-gray-700">{key.replace("_", " ").toUpperCase()}</label>
            {key === "fuel_type" || key === "vehicle_type" ? (
              <select value={formData[key]} onChange={(e) => handleChange(key, e.target.value)} className="p-2 border rounded-lg focus:ring focus:ring-blue-300">
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
              <input type={typeof formData[key] === "number" ? "number" : "text"} value={formData[key]} onChange={(e) => handleChange(key, typeof formData[key] === "number" ? parseFloat(e.target.value) || 0 : e.target.value)} className="p-2 border rounded-lg focus:ring focus:ring-blue-300" />
            )}
          </motion.div>
        ))}
      </div>
      <motion.button onClick={isRunning ? stopTrip : startTrip} className={`mt-6 px-5 py-3 rounded-lg shadow-lg text-white text-lg font-semibold transition flex items-center gap-2 ${isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`} whileTap={{ scale: 0.9 }}>
        <FaClock /> {isRunning ? "Stop Trip" : "Start Trip"}
      </motion.button>
      <div className="w-full bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Graphical Analysis</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="speed" stroke="#8884d8" />
            <Line type="monotone" dataKey="acceleration" stroke="#82ca9d" />
            <Line type="monotone" dataKey="distance" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}