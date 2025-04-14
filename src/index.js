import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { TransactionProvider } from "./contexts/TransactionContext"; // Import your context provider

ReactDOM.render(
  <React.StrictMode>
    <TransactionProvider>  {/* Wrap your App with TransactionProvider */}
      <App />
    </TransactionProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
