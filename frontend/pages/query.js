import { useState } from "react";
import axios from "axios";

export default function QueryPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);

  const handleQuery = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/ask?q=${query}`);
      setResult(response.data.prediction);
    } catch (error) {
      setResult("Error: " + error.response?.data.detail);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Ask a Question</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter values (comma-separated)"
        className="border p-2 my-2"
      />
      <button onClick={handleQuery} className="px-4 py-2 bg-blue-500 text-white">Submit</button>
      {result && <p className="mt-2">Prediction: {result}</p>}
    </div>
  );
}
 
