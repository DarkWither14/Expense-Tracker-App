import React from "react";
import AddTransaction from "./components/AddTransaction";
import TransactionHistory from "./components/TransactionHistory";
import { TransactionProvider } from "./contexts/TransactionContext";
import Balance from "./components/Balance";

const App = () => {
  return (
    <TransactionProvider>
      <div className="app-container">
        <h1>Expense Tracker</h1>
        <Balance />
        <AddTransaction />
        <TransactionHistory />
      </div>
    </TransactionProvider>
  );
};

export default App;
