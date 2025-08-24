import { useState } from "react";
import api from "../services/api";

export default function AddAgent() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.post("/agents/add", form);
      setMessage(res.data.message);
      setForm({ name: "", email: "", mobile: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "❌ Failed to add agent");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-agent-form">
      <input
        className="auth-input"
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        className="auth-input"
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        className="auth-input"
        type="text"
        name="mobile"
        placeholder="Mobile (+91XXXXXXXXXX)"
        value={form.mobile}
        onChange={handleChange}
        required
      />
      <input
        className="auth-input"
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <button className="auth-button" type="submit">
        Add Agent
      </button>

      {message && <p className="auth-success">{message}</p>}
      {error && <p className="auth-error">{error}</p>}
    </form>
  );
}
