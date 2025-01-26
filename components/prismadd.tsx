import React, { useState } from "react";

const PrismaAddButton = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/populatemain");
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage("Failed to populate database. Check the console for errors.");
        console.error(data);
      }
    } catch (error) {
      setMessage("An error occurred. Check the console for details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Processing..." : "Populate Database"}
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default PrismaAddButton;
