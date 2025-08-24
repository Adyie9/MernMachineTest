// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import TaskPage from "./components/TaskPage";
import UploadCSV from "./components/UploadCSV";

// Wrapper for Login with navigation support
function LoginWrapper({ onLogin }) {
  const navigate = useNavigate();
  return (
    <Login
      onLogin={onLogin}
      onSwitchToRegister={() => navigate("/register")}
    />
  );
}

// Wrapper for Register with navigation support
function RegisterWrapper({ onRegisterSuccess }) {
  const navigate = useNavigate();
  return (
    <Register
      onRegisterSuccess={() => {
        onRegisterSuccess();
        navigate("/");
      }}
      onSwitchToLogin={() => navigate("/")}
    />
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginWrapper onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />

        <Route
          path="/register"
          element={
            <RegisterWrapper onRegisterSuccess={() => setIsLoggedIn(false)} />
          }
        />

        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard onLogout={() => setIsLoggedIn(false)} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/upload"
          element={isLoggedIn ? <UploadCSV /> : <Navigate to="/" />}
        />

        <Route
          path="/tasks"
          element={isLoggedIn ? <TaskPage /> : <Navigate to="/" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
