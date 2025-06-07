import React, { useContext, useState } from "react";
import { TransactionContext } from "../contexts/TransactionContext";
import "./TransactionHistory.css";

const TransactionHistory = () => {
  const { transactions } = useContext(TransactionContext);
  const [sortType, setSortType] = useState("date");
  const [filterCategory, setFilterCategory] = useState("");

  // Debug log to verify transactions are being received
  console.log("Transactions in history:", transactions);

  // Handle empty or invalid dates by providing a default
  const getSortDate = (dateStr) => {
    try {
      return dateStr ? new Date(dateStr) : new Date(0);
    } catch (e) {
      return new Date(0);
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortType === "amount") return b.amount - a.amount;
    if (sortType === "date") return getSortDate(b.date) - getSortDate(a.date);
    if (sortType === "category") {
      return (a.category || "").localeCompare(b.category || "");
    }
    return 0;
  });

  const filteredTransactions = filterCategory
    ? sortedTransactions.filter((transaction) => 
        (transaction.category || "").toLowerCase().includes(filterCategory.toLowerCase())
      )
    : sortedTransactions;

  return (
    <div className="transaction-history">
      <h2>Transaction History</h2>

      <div className="transaction-filters">
        <div className="filter-group">
          <label htmlFor="sortType">Sort by:</label>
          <select 
            id="sortType"
            value={sortType} 
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filterCategory">Filter by Category:</label>
          <input
            id="filterCategory"
            type="text"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            placeholder="Enter category"
          />
        </div>
      </div>

      {transactions.length === 0 ? (
        <p>No transactions to display. Add some transactions to get started!</p>
      ) : (
        <div className="transaction-list">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-info">
                <h4>{transaction.description}</h4>
                <p>
                  {transaction.category} • {transaction.date ? new Date(transaction.date).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div className={`transaction-amount ${transaction.type}`}>
                ${Math.abs(transaction.amount).toFixed(2)}
              </div>
              <div className="transaction-actions">
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;