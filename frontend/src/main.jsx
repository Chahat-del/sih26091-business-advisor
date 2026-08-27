import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AppFlowProvider } from "./context/AppFlowContext.jsx";
import "./styles/tokens.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppFlowProvider>
        <App />
      </AppFlowProvider>
    </BrowserRouter>
  </StrictMode>
);
