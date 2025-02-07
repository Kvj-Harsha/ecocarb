"use client";

import { useState, useEffect, useRef } from "react";
import { FaCar, FaClock, FaCloud, FaExclamationTriangle, FaMoon, FaSun } from "react-icons/fa";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { chatSession } from "@/app/service/AIModal";
import { auth, db } from "@/lib/firebase";




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
  const [result2, setResult2] = useState<{
    immediate_action: string;
    tip1: string;
    tip2: string;
  } | null>(null);
  const [error3, setError3] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result_2, setResult_2] = useState<string | null>(null);
  const [error_2, setError_2] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [extraEmission, setExtraEmission] = useState<number | null>(null);
  const [harshDrivingData, setHarshDrivingData] = useState<
    { time: string; harshDriving: number }[]
  >([]);
  const [darkMode, setDarkMode] = useState(false);

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


  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };
  
  // Gemini prediction function (refactored from handleSubmit)
  const generateGeminiPrediction = async () => {
    setError3(null);
    setResult2(null);

    // Check required fields

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

  // Call the API to predict CO₂ emission and update the emission graph
  const handlePredict = async () => {
    setError(null);
    setResult(null);
    if (formData.distance_traveled === 0 || formData.fuel_type === "Electric") {
      setResult("0");
      setEmissionGraphData((prev) => [
        ...prev,
        { time: new Date().toLocaleTimeString(), emission: 0 },
      ]);
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
        setResult(`${data.predicted_emission}`);
        setEmissionGraphData((prev) => [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            emission: data.predicted_emission,
          },
        ]);
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("Failed to connect to the server");
    }
  };

  const handlePredict_harshdrivinng = async () => {
    setError_2(null);
    setResult_2(null);
    try {
      const response = await fetch(
        "http://127.0.0.1:5001/predict-harsh-driving",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      if (response.ok) {
        setResult_2(`Harsh Driving: ${data.harsh_driving ? "Yes" : "No"}`);
        setExtraEmission(data.harsh_driving ? data.harsh_emission || 0 : 0); // Ensure valid number
        setHarshDrivingData((prev) => [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            harshDriving: data.harsh_driving ? 1 : 0,
          },
        ]);
      } else {
        setError_2(data.error || "An error occurred");
      }
    } catch (err) {
      setError_2("Failed to connect to the server");
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
        const newDistance =
          (prev.distance_traveled as number) + (newSpeed / 3600) * 1000;
        // Update simulation graph data
        setSimData((prevSim) => [
          ...prevSim,
          {
            time: new Date().toLocaleTimeString(),
            speed: newSpeed,
            acceleration: newAcceleration,
            distance: newDistance,
          },
        ]);
        return {
          ...prev,
          acceleration: newAcceleration,
          speed: newSpeed,
          distance_traveled: newDistance,
        };
      });
    }, 10000);
  };


  const generateTripId = () => `trip-${Date.now()}`;


  const stopTrip = async (formData: Record<string, string | number>, result: string | null) => { 
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Fetch the current username
    const username = auth.currentUser?.displayName || "Guest"; // Ensure username is always available
    if (!username) {
      console.error("Error: Username is undefined.");
      return;
    }
  
    const tripId = generateTripId(); // Generate trip ID
  
  try {
    await addDoc(collection(db, "trips"), {
      tripId,
      username,
      date: new Date().toISOString().split("T")[0],
      timestamp: serverTimestamp(),
      carbon_emission: result, // ✅ Storing carbon emission
      ...formData, // ✅ Storing all form data dynamically
    });

    console.log("Trip data stored successfully!");
  } catch (error) {
    console.error("Error storing trip data:", error);
  }
};
  

  // Automatically trigger all API predictions when key simulation parameters update
  useEffect(() => {
    handlePredict_harshdrivinng();
    handlePredict();
    generateGeminiPrediction();
  }, [
    formData.speed,
    formData.acceleration,
    formData.distance_traveled,
    formData.fuel_type,
  ]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);
  

  return (
    <section className="bg-gray-100  dark:bg-black">
      <section className="text-3xl text-center bg-gray-100 dark:bg-black dark:text-white py-5 font-semibold">AI Carbon Emission Dashboard</section>
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 shadow-md transition"
      >
        {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
      </button>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-100 dark:bg-black min-h-screen ">
        {/* form  this should be half left*/}
        <div className="md:col-span-1 p-4 border rounded-lg shadow-md bg-white">
          <form className="w-full">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2 mb-4">
              <FaCar /> Simulation Parameters
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {Object.keys(formData).map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    {key.replace("_", " ").toUpperCase()}
                  </label>
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
                      type={
                        typeof formData[key] === "number" ? "number" : "text"
                      }
                      value={formData[key]}
                      onChange={(e) =>
                        handleChange(
                          key,
                          typeof formData[key] === "number"
                            ? parseFloat(e.target.value) || 0
                            : e.target.value
                        )
                      }
                      className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-4">
              {/* Trip start/stop button */}
              <button
  type="button"
  onClick={() =>
    isRunning
      ? stopTrip(formData, result) // ✅ Pass `result` (carbon emission) along with `formData`
      : startTrip()
  }
  className={`flex items-center px-5 py-3 rounded-lg shadow-lg text-white text-lg font-semibold transition ${
    isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
  }`}
>
  <FaClock className="text-2xl" />
  <span className="ml-2">{isRunning ? "Stop Trip" : "Start Trip"}</span>
</button>


            </div>
          </form>
        </div>

        <div className="col-span-2 grid grid-cols-1 grid-cols-2 gap-6">
          {/* carbon emmited  this should 1/3 of right*/}
          <div className="w-full bg-white p-4 border rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4">Predicted CO₂ Emission</h2>
            <div className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
              <FaCloud /> Predicted CO₂ Emission: {result || "CO₂ Emission: -- grams"} grams
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={emissionGraphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis
                  label={{
                    value: "Emission (g)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="emission"
                  stroke="#ff0000"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Harsh Driving  this should 1/3 of right */}
          <div className="w-full bg-white p-4 border rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4">Harsh Driving Status</h2>
            <div className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">
              <FaExclamationTriangle /> {result_2 || "Analyzing..."}
            </div>
            {extraEmission !== null && (
              <div className="text-lg font-medium text-gray-800 mb-4">
                Carbon is Emmited Due to Harsh Driving:{" "} <br/>
                <span className="font-bold text-red-500">
                  {extraEmission ? extraEmission : "0.0000"} grams of CO₂
                </span>
              </div>
            )}
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={harshDrivingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis
                  label={{
                    value: "Harsh Driving",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="harshDriving"
                  stroke="#ff0000"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gemini API Prediction Results  this should 1/3 of right */}
          <div className="col-span-2 p-4 border text-4xl rounded-lg shadow-md bg-white">
            {result2 ? (
            
            <div>

                  <div className="p-4 bg-white rounded-lg shadow-md border">
                    <h2 className="font-semibold p-2 text-center">AI Insights!</h2>
                  </div>   

                  <div className="p-4 bg-white mt-4 rounded-lg shadow-md border">
                    <h2 className="font-semibold p-2">Immediate Action:</h2>
                    <p className="text-green-600 p-2">{result2.immediate_action}</p>
                  </div>

                  <div className="p-4 mt-4 bg-white rounded-lg shadow-md border">
                    <h2 className="font-semibold p-2">Tips:</h2>
                    <p className="text-blue-600 p-2">1. {result2.tip1}</p>
                    <p className="text-blue-600 p-2">2. {result2.tip2}</p>
                  </div>

            </div>

            ) : error3 ? (
              <p className="text-red-600 text-xl font-semibold">{error3}</p>
            ) : (
              <p className="text-gray-500 text-lg">
                Waiting for Gemini Prediction...
              </p>
            )}
          </div>
        </div>

        {/* Metrics Graph down of both */}
        <div className="md:col-span-3 p-4 border rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-bold mb-4">
            Simulation Parameters Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={simData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis
                yAxisId="left"
                label={{
                  value: "Speed/Accel",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "Distance (m)",
                  angle: 90,
                  position: "insideRight",
                }}
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
    </section>
  );
}
