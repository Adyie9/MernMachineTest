// src/components/UploadCSV.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function UploadCSV() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setFile(e.target.files[0]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!file) return setMsg("Please choose a file.");

    const allowed = ["csv", "xlsx", "xls"];
    const ext = file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      return setMsg("Only CSV, XLSX, XLS allowed.");
    }

    const form = new FormData();
    form.append("file", file);

    try {
      const { data } = await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg(`✅ ${data.message} (Total: ${data.total})`);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload & Distribute CSV/XLSX</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={onChange}
          className="border p-2 rounded w-full"
          
        />
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
          >
            Upload & Distribute
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            ← Back to Dashboard
          </button>
        </div>
      </form>

      {msg && <p className="mt-4">{msg}</p>}

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Required headers:</strong> FirstName, Phone, Notes</p>
      </div>
    </div>
  );
}
