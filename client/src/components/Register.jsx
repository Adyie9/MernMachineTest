import { useState } from "react";
import api from "../services/api";

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [name, setName] = useState("");
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
      await api.post("/auth/register", { name, email, password, role }); // ✅ send role
      setMessage("✅ Registration successful! Please log in.");
      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "❌ Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>MERN Auth Demo</h2>
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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

        <button className="auth-button" type="submit">Register</button>
      </form>

      {error && <p className="auth-error">{error}</p>}
      {message && <p className="auth-success">{message}</p>}

      <p style={{ marginTop: "1rem" }}>
        Already have an account?{" "}
        <button
          type="button"
          style={{ color: "#4f46e5", background: "none", border: "none", cursor: "pointer" }}
          onClick={onSwitchToLogin}
        >
          Login
        </button>
      </p>
    </div>
  );
}
