import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

function readConfiguredBasePath() {
  const basePath = document.querySelector('meta[name="blinkride-base-path"]')?.getAttribute("content") || "/";
  return basePath.endsWith("/") ? basePath : `${basePath}/`;
}

const configuredBasePath = readConfiguredBasePath();
const basePath = window.location.pathname.startsWith(configuredBasePath) ? configuredBasePath : "/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={basePath}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
