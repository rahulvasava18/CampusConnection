import React, { useEffect, useState } from "react";
import axios from "axios";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const token = localStorage.getItem("authToken");
//         const response = await axios.get("/api/events", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         console.log("API response.data:", response.data);

//         // Adjust this line depending on your API response shape:
//         if (Array.isArray(response.data)) {
//           setEvents(response.data);
//         } else if (Array.isArray(response.data.data)) {
//           setEvents(response.data.data);
//         } else {
//           setEvents([]);
//           setError("Unexpected response format");
//         }
//       } catch (err) {
//         setError(err.message || "Failed to fetch events");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   if (loading) return <p>Loading events...</p>;
//   if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">upcoming Events</h2>
      {Array.isArray(events) && events.length > 0 ? (
        <ul>
          {events.map((event, index) => (
            <li
              key={event.id || index}
              className="mb-4 p-4 border rounded shadow bg-white"
            >
              <pre>{JSON.stringify(event, null, 2)}</pre>
            </li>
          ))}
        </ul>
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default UpcomingEvents;
