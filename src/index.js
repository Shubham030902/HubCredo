import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Import Tailwind CSS
import App from "./App"; // Imports the correct App.js component

// This is the standard entry point for a Create React App project.
// It finds the 'root' div in your public/index.html and renders your App component into it.

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
