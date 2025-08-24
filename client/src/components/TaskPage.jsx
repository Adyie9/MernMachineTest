// src/components/TaskPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function TaskPage() {
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/tasks/grouped")
      .then((res) => setTasks(res.data || {}))
      .catch(() => setError("Failed to fetch tasks"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex justify-center">
      <div className="distributed-container">
        <div className="distributed-header">
          <h2>Distributed Tasks by Agent</h2>
          <div className="space-x-2">
            
            <Link to="/dashboard">
              <button style={{ background: "#e5e7eb", color: "#111827" }}>
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>

        {loading && <p>Loading tasks...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            {Object.keys(tasks).map((agent) => (
              <div key={agent} className="agent-section">
                <h3>{agent}</h3>
                <table className="agent-table">
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Phone</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks[agent].map((t, i) => (
                      <tr key={i}>
                        <td>{t.firstName}</td>
                        <td>📞 {t.phone}</td>
                        <td>{t.notes || "No notes"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
