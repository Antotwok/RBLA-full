import React, { useEffect, useState } from "react";
import "./Marquee.css";

const Marquee = () => {
  const [message, setMessage] = useState("Welcome to Survivor Products!");

  useEffect(() => {
    fetch("http://localhost:5000/api/public/marquee")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error("Error fetching marquee:", err);
        // Keep the default message on error
      });
  }, []);

  return (
    <div className="marquee-container">
      <marquee behavior="scroll" direction="left">🎉 {message} 🎉</marquee>
    </div>
  );
};

export default Marquee;
