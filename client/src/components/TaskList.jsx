import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const TaskList = () => {
  const [tasks, setTasks] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks/grouped", { withCredentials: true })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      {/* ✅ Header with Logout & Back */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Distributed Tasks by Agent</h2>
        <div className="flex gap-3">
          <Link to="/dashboard">
            <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
              Back to Dashboard
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {Object.keys(tasks).map((agent) => (
          <div
            key={agent}
            className="bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-2xl"
          >
            <h3 className="text-xl font-semibold text-indigo-700 mb-4">
              {agent}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">First Name</th>
                    <th className="py-2 px-4 border-b text-left">Phone</th>
                    <th className="py-2 px-4 border-b text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks[agent].map((task, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b font-medium text-gray-800">
                        {task.firstName}
                      </td>
                      <td className="py-2 px-4 border-b text-gray-600">
                        📞 {task.phone}
                      </td>
                      <td className="py-2 px-4 border-b text-gray-600">
                        {task.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
