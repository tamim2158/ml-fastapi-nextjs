 
import { useState } from "react";
import axios from "axios";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/learn", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error uploading file: " + error.response?.data.detail);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Upload CSV for Training</h1>
      <input type="file" onChange={handleFileChange} className="block my-2" />
      <button onClick={handleUpload} className="px-4 py-2 bg-blue-500 text-white">Upload</button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
