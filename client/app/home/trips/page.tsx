"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChevronDown, Filter, Download, Calendar } from "lucide-react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { startOfWeek, endOfWeek, parseISO, format } from "date-fns";

type Trip = {
  id: string;
  tripId: string;
  distance_traveled: number;
  carbon_emission: number;
  date: string;
  [key: string]: any;
};

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedTrips, setSelectedTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      const querySnapshot = await getDocs(collection(db, "trips"));
      const tripsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Trip[];
      setTrips(tripsData);
    };
    fetchTrips();
  }, []);

  const filteredTrips = trips.filter(trip =>
    trip.tripId.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleSelectTrip = (trip: Trip) => {
    setSelectedTrips(prev =>
      prev.some(t => t.id === trip.id)
        ? prev.filter(t => t.id !== trip.id)
        : [...prev, trip]
    );
  };

  const selectWeeklyTrips = () => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });

    const weeklyTrips = trips.filter(trip => {
      const tripDate = parseISO(trip.date);
      return tripDate >= start && tripDate <= end;
    });

    setSelectedTrips(weeklyTrips);
  };

  return (
    <div className="p-6 max-w-4xl bg-black mx-auto text-white">
      {/* Filter Input */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by Trip ID"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 text-black"
        />
        <button className="p-2 border rounded-md hover:bg-gray-100">
          <Filter className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Trips List */}
      <motion.div className="grid gap-4 sm:grid-cols-2">
        {filteredTrips.map((trip) => (
          <div key={trip.id} className="p-4 border rounded-xl shadow-md bg-gray-800">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Trip ID: {trip.tripId}</p>
              <input
                type="checkbox"
                checked={selectedTrips.some(t => t.id === trip.id)}
                onChange={() => toggleSelectTrip(trip)}
                className="w-4 h-4"
              />
            </div>
            <p className="text-sm text-gray-400">Distance: {trip.distance_traveled} km</p>
            <p className="text-sm text-gray-400">Carbon Emission: {trip.carbon_emission} kg</p>
            <p className="text-sm text-gray-400">Date: {trip.date}</p>

            {/* Expanded Details */}
            {expanded === trip.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2"
              >
                {Object.entries(trip)
                  .filter(([key]) => !["id", "tripId", "distance_traveled", "carbon_emission", "date"].includes(key))
                  .map(([key, value]) => (
                    <p key={key} className="text-sm text-gray-300">
                      {key}: {String(value)}
                    </p>
                  ))}
              </motion.div>
            )}

            {/* Expand Button */}
            <button
              className="mt-2 flex items-center gap-1 text-blue-400 hover:underline"
              onClick={() => setExpanded(expanded === trip.id ? null : trip.id)}
            >
              More
              <ChevronDown className={`w-4 h-4 transition-transform ${expanded === trip.id ? "rotate-180" : ""}`} />
            </button>
          </div>
        ))}
      </motion.div>

      {/* Comparison & Report Generation */}
      {selectedTrips.length > 0 && (
        <div className="mt-6 p-4 border rounded-xl bg-gray-900 shadow-lg">
          <h2 className="text-xl font-semibold">Selected Trips for Comparison</h2>
          <p className="text-sm text-gray-400">Trips Selected: {selectedTrips.length}</p>
          <p className="text-sm text-gray-400">
            Total Distance: {selectedTrips.reduce((sum, trip) => sum + trip.distance_traveled, 0)} km
          </p>
          <p className="text-sm text-gray-400">
            Total Carbon Emission: {selectedTrips.reduce((sum, trip) => sum + trip.carbon_emission, 0)} kg
          </p>

          {/* Weekly Report Button */}
          <button
            onClick={selectWeeklyTrips}
            className="mt-4 px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700 flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" /> Weekly Report
          </button>

          {/* PDF Download */}
          <PDFDownloadLink
            document={<ReportPDF trips={selectedTrips} />}
            fileName="Trip_Report.pdf"
            className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 inline-block"
          >
            <Download className="w-5 h-5" /> Download PDF
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
}

// PDF Document
const styles = StyleSheet.create({
  page: { padding: 20 },
  title: { fontSize: 20, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 5 },
  separator: { borderBottom: "1px solid black", marginVertical: 5 }
});

const ReportPDF = ({ trips }: { trips: Trip[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Trip Report</Text>
      {trips.map(trip => (
        <View key={trip.id}>
          <Text style={styles.text}>Trip ID: {trip.tripId}</Text>
          <Text style={styles.text}>Distance: {trip.distance_traveled} km</Text>
          <Text style={styles.text}>Carbon Emission: {trip.carbon_emission} kg</Text>
          <Text style={styles.text}>Date: {trip.date}</Text>
          <View style={styles.separator} />
        </View>
      ))}
    </Page>
  </Document>
);
