import { useState } from "react"; 
import api from "../services/api";

export default function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("agent"); // default role
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await api.post("/auth/login", { email, password }); 
      const userRole = res.data?.user?.role;

      if (userRole !== role) {
        setError("❌ Access denied: Wrong role selected");
        return;
      }

      setMessage("✅ Login successful!");
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || "❌ Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>MERN Auth Demo</h2>
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Role selection */}
        <select
          className="auth-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
        </select>

        <button className="auth-button" type="submit">Login</button>
      </form>

      {error && <p className="auth-error">{error}</p>}
      {message && <p className="auth-success">{message}</p>}

      <p style={{ marginTop: "1rem" }}>
        Don’t have an account?{" "}
        <button
          type="button"
          style={{ color: "#4f46e5", background: "none", border: "none", cursor: "pointer" }}
          onClick={onSwitchToRegister}
        >
          Register
        </button>
      </p>
    </div>
  );
}
