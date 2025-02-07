"use client";

import { useState, useEffect, useRef } from "react";
import { FaCar, FaClock, FaExclamationTriangle } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function HarshDrivingDetector() {
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
        cylinders: 4,
        engine_size: 3,
        make: "BMW",
        model: 2022,
        transmission: "Manual",
    });
    
    const [result, setResult] = useState<string | null>(null);
    const [extraEmission, setExtraEmission] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [harshDrivingData, setHarshDrivingData] = useState<{ time: string; harshDriving: string }[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const handleChange = (field: string, value: number | string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handlePredict = async () => {
        setError(null);
        setResult(null);
        try {
            const response = await fetch("http://127.0.0.1:5001/predict-harsh-driving", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
            console.log("API Response:", data); // Debugging
    
            if (response.ok) {
                setResult(`Harsh Driving: ${data.harsh_driving ? "Yes" : "No"}`);
                setExtraEmission(data.harsh_driving ? data.harsh_emission || 0 : 0); // Ensure valid number
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
                if ((prev.speed as number) >= 220) {
                    clearInterval(intervalRef.current!);
                    return prev;
                }
                const newAcceleration = (prev.acceleration as number) + 0.02;
                const newSpeed = (prev.speed as number) + newAcceleration;
                return { ...prev, acceleration: newAcceleration, speed: newSpeed };
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
    }, [formData.speed, formData.acceleration]);

    return (
        <section className="min-h-screen bg-black p-6 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2 bg-white p-6 shadow-lg rounded-lg">
                    <h2 className="text-3xl font-bold flex items-center gap-2 mb-4">
                        <FaCar /> Harsh Driving Detection
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {Object.keys(formData).map((key) => (
                            <div key={key} className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">{key.replace("_", " ").toUpperCase()}</label>
                                <input
                                    type={typeof formData[key] === "number" ? "number" : "text"}
                                    value={formData[key]}
                                    onChange={(e) => handleChange(key, parseFloat(e.target.value) || 0)}
                                    className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={isRunning ? stopTrip : startTrip}
                            className={`px-5 py-3 rounded-lg shadow-lg text-white text-lg font-semibold transition ${isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                                }`}
                        >
                            <FaClock className="mr-2" /> {isRunning ? "Stop Trip" : "Start Trip"}
                        </button>
                    </div>
                </div>
                <div className="w-full md:w-1/2 bg-white p-6 shadow-lg rounded-lg">
                    <h2 className="text-3xl font-bold mb-4">Harsh Driving Status</h2>
                    <div className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">
                        <FaExclamationTriangle /> {result || "Analyzing..."}
                    </div>
                    {extraEmission !== null && (
                        <div className="text-lg font-medium text-gray-800 mb-4">
    Extra Carbon Emission Due to Harsh Driving: 
    <span className="font-bold text-red-500">
        {extraEmission ? extraEmission : "0.0000"} grams of CO₂
    </span>
</div>

                    )}
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={harshDrivingData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis label={{ value: "Harsh Driving", angle: -90, position: "insideLeft" }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="harshDriving" stroke="#ff0000" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
}
