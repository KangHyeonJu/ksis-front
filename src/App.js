// src/App.js
import React from "react";
import "./index.css"; // Catalyst 및 Tailwind CSS 포함
import Sidebar from "./components/sidebar/Sidebar.jsx";

const App = () => {
  return (
    <div className="dashboard">
      <Sidebar />
    </div>
  );
};

export default App;
