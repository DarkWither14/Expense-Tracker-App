import React, { useContext, useEffect } from "react";
import AddTransaction from "./components/AddTransaction";
import TransactionHistory from "./components/TransactionHistory";
import TransactionList from "./components/TransactionList";
import { TransactionProvider } from "./contexts/TransactionContext";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocaleProvider } from "./contexts/LocaleContext";
import Balance from "./components/Balance";
import PieChart from "./components/PieChart";
import LineGraph from "./components/LineGraph";
import RecurringTransactions from "./components/RecurringTransactions";
import BudgetManager from "./components/BudgetManager";
import DataManager from "./components/DataManager";
import NotificationManager from "./components/NotificationManager";
import Settings from "./components/Settings";
import Auth from "./components/Auth";
import "./App.css";

const AppContent = () => {
  const { currentUser, logout, isOffline, syncData } = useContext(AuthContext);

  useEffect(() => {
    // Sync data when coming back online
    if (!isOffline) {
      syncData();
    }
  }, [isOffline, syncData]);

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <TransactionProvider>
      <div className="app-container">
        <header className="app-header">
          <h1>Expense Tracker</h1>
          <div className="user-info">
            {isOffline && (
              <span className="offline-badge">Offline Mode</span>
            )}
            <span>Welcome, {currentUser.email}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </header>

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
            <h2>Budget Management</h2>
            <BudgetManager />
          </div>

          <div className="dashboard-section">
            <h2>Transaction History</h2>
            <TransactionList />
            <TransactionHistory />
          </div>

          <div className="dashboard-section">
            <h2>Data Management</h2>
            <DataManager />
          </div>

          <div className="dashboard-section">
            <h2>Notifications & Reminders</h2>
            <NotificationManager />
          </div>

          <div className="dashboard-section">
            <Settings />
          </div>
        </div>
      </div>
    </TransactionProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
};

export default App;
