import React from "react";
import AddTransaction from "./components/AddTransaction";
import TransactionHistory from "./components/TransactionHistory";
import TransactionList from "./components/TransactionList";
import { TransactionProvider } from "./contexts/TransactionContext";
import Balance from "./components/Balance";
import PieChart from "./components/PieChart";
import LineGraph from "./components/LineGraph";
import RecurringTransactions from "./components/RecurringTransactions";
import "./App.css";

const App = () => {
  return (
    <TransactionProvider>
      <div className="app-container">
        <h1>Expense Tracker</h1>
        <div className="dashboard-grid">
          <div className="dashboard-section">
            <Balance />
            <AddTransaction />
            <RecurringTransactions />
          </div>
          
          <div className="dashboard-section">
            <h2>Visualizations</h2>
            <div className="charts-container">
              <PieChart />
              <LineGraph />
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Transaction History</h2>
            <TransactionList />
            <TransactionHistory />
          </div>
        </div>
      </div>
    </TransactionProvider>
  );
};

export default App;
