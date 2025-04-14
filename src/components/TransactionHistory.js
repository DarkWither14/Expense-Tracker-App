import React, { useContext, useState } from "react";
import { TransactionContext } from "../contexts/TransactionContext";

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

      <div className="controls">
        <label>
          Sort by: 
          <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
          </select>
        </label>
        <label>
          Filter by Category:
          <input
            type="text"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            placeholder="Enter category"
          />
        </label>
      </div>

      {transactions.length === 0 ? (
        <p>No transactions to display. Add some transactions to get started!</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #ddd" }}>Type</th>
              <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #ddd" }}>Description</th>
              <th style={{ textAlign: "right", padding: "0.5rem", borderBottom: "1px solid #ddd" }}>Amount</th>
              <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #ddd" }}>Category</th>
              <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #ddd" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>{transaction.type}</td>
                <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>{transaction.description}</td>
                <td 
                  style={{ 
                    padding: "0.5rem", 
                    borderBottom: "1px solid #eee", 
                    color: transaction.type === "expense" ? "red" : "green",
                    textAlign: "right"
                  }}
                >
                  ${Math.abs(transaction.amount).toFixed(2)}
                </td>
                <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>{transaction.category}</td>
                <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>
                  {transaction.date ? new Date(transaction.date).toLocaleDateString() : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionHistory;