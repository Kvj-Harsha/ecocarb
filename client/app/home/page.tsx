"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

// Define the Trip type
type Trip = {
  id: string;
  tripId: string;
  distance_traveled: number;
  carbon_emission: number;
  date: string;
};

// Define the Insight type
type Insight = {
  increase: boolean;
  percentage: number;
} | null;

const Page = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [insight, setInsight] = useState<Insight>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const tripsRef = collection(db, "trips");
        const q = query(tripsRef, orderBy("timestamp", "desc"), limit(2));
        const querySnapshot = await getDocs(q);

        const tripsData: Trip[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            tripId: data.tripId || "N/A",
            distance_traveled: data.distance_traveled || 0,
            carbon_emission: data.carbon_emission || 0,
            date: data.date || new Date().toISOString(),
          };
        });

        setTrips(tripsData);

        // Calculate insights if we have at least two trips
        if (tripsData.length === 2) {
          const [latest, previous] = tripsData;
          const latestEmission = Number(latest.carbon_emission);
          const previousEmission = Number(previous.carbon_emission);

          if (!isNaN(latestEmission) && !isNaN(previousEmission) && previousEmission > 0) {
            const diff = latestEmission - previousEmission;
            const percentageChange = ((diff / previousEmission) * 100).toFixed(2);

            setInsight({
              increase: diff > 0,
              percentage: Math.abs(parseFloat(percentageChange)),
            });
          }
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, []);

  return (
    <section className="p-6 h-[84vh] flex flex-col items-center justify-center bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to EcoCarb!</h1>
        <p className="text-lg">Explore our services and track your carbon emissions!</p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg"
      >
        <a href="/home/simulate">Simulate</a>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Latest Trips</h2>
        {trips.length > 0 ? (
          trips.map((trip) => (
            <motion.div
              key={trip.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 mb-4 bg-gray-700 rounded-xl shadow-lg"
            >
              <p className="text-lg">
                <strong>Trip ID:</strong> {trip.tripId}
              </p>
              <p>
                <strong>Distance:</strong> {trip.distance_traveled} km
              </p>
              <p>
                <strong>Emissions:</strong> {trip.carbon_emission} g CO₂
              </p>
              <p>
                <strong>Date:</strong> {new Date(trip.date).toLocaleString()}
              </p>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-400">No trips available.</p>
        )}
      </motion.div>

      {/* Insights Box */}
      {insight && (
        <motion.div
          className="mt-6 p-4 bg-blue-600 text-white rounded-lg shadow-lg text-center max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold">Insights</h3>
          <p>
            Carbon emissions have {insight.increase ? "increased" : "decreased"} by{" "}
            {insight.percentage}% compared to the previous trip.
          </p>
        </motion.div>
      )}
    </section>
  );
};

export default Page;
