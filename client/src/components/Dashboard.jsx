import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Dashboard({ onLogout }) {
  const [message, setMessage] = useState("Loading...");
  const [role, setRole] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [agentData, setAgentData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [status, setStatus] = useState("");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // ✅ Fetch role + email on mount
  useEffect(() => {
    api
      .get("/auth/dashboard")
      .then((res) => {
        setMessage(res.data.message);
        setRole(res.data.role);

        if (res.data.role === "agent") {
          fetchAgentTasks();
        }
      })
      .catch(() => {
        setMessage("Unauthorized. Please login.");
        setRole(null);
      });
  }, []);

  const fetchAgentTasks = async () => {
    try {
      const res = await api.get("/tasks/agent");
      setTasks(res.data || []);
    } catch {
      setTasks([]);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      onLogout();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- Admin Handlers ----------
  const handleChange = (e) => {
    setAgentData({ ...agentData, [e.target.name]: e.target.value });
  };

  const handleAddAgent = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/agents/add", agentData);
      setStatus(res.data.message);
      setAgentData({ name: "", email: "", mobile: "", password: "" });
    } catch (err) {
      setStatus(err.response?.data?.message || "Error adding agent. Try again.");
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return setUploadStatus("Please select a file first.");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus(res.data.message);
      setFile(null);
    } catch (err) {
      setUploadStatus(err.response?.data?.message || "Error uploading file.");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>{role === "agent" ? "Agent Dashboard" : "Admin Dashboard"}</h2>

      <p>{message}</p>

      {/* ✅ Agent Dashboard */}
      {role === "agent" && (
        <div className="agent-form">
          {tasks.length === 0 ? (
            <p>No tasks assigned yet.</p>
          ) : (
            <table className="agent-table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Phone</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t, i) => (
                  <tr key={i}>
                    <td>{t.firstName}</td>
                    <td>📞 {t.phone}</td>
                    <td>{t.notes || "No notes"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ✅ Admin Dashboard */}
      {role === "admin" && (
        <div className="dashboard-sections">
          {/* Add Agent Form */}
          <div className="agent-form">
            <h3>Add Agent</h3>
            <form onSubmit={handleAddAgent}>
              <input
                className="auth-input"
                type="text"
                name="name"
                placeholder="Name"
                value={agentData.name}
                onChange={handleChange}
                required
              />
              <input
                className="auth-input"
                type="email"
                name="email"
                placeholder="Email"
                value={agentData.email}
                onChange={handleChange}
                required
              />
              <input
                className="auth-input"
                type="text"
                name="mobile"
                placeholder="Mobile (+91XXXXXXXXXX)"
                value={agentData.mobile}
                onChange={handleChange}
                required
              />
              <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="Password"
                value={agentData.password}
                onChange={handleChange}
                required
              />
              <button className="auth-button">Add Agent</button>
            </form>
            {status && <p className="auth-success">{status}</p>}
          </div>

          {/* Upload CSV/XLSX Form */}
          <div className="upload-form">
            <h3>Upload CSV/XLSX</h3>
            <form onSubmit={handleFileUpload}>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                required
              />
              <button className="auth-button">Upload & Distribute</button>
            </form>
            {uploadStatus && <p className="auth-success">{uploadStatus}</p>}

            <Link to="/tasks">
              <button className="view-tasks-button">View Distributed Tasks</button>
            </Link>
          </div>
        </div>
      )}

      {/* Logout */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
