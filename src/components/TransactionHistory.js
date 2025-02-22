import React, { useContext, useState } from "react";
import { TransactionContext } from "../contexts/TransactionContext";

const TransactionHistory = () => {
  const { transactions } = useContext(TransactionContext);
  const [sortType, setSortType] = useState("date");
  const [filterCategory, setFilterCategory] = useState("");

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortType === "amount") return b.amount - a.amount;
    if (sortType === "date") return new Date(b.date) - new Date(a.date);
    if (sortType === "category") return a.category.localeCompare(b.category);
    return 0;
  });

  const filteredTransactions = filterCategory
    ? sortedTransactions.filter((transaction) => 
        transaction.category.toLowerCase().includes(filterCategory.toLowerCase())
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

      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.type}</td>
              <td>{transaction.description}</td>
              <td className={transaction.type === "expense" ? "expense" : "income"}>
                ${Math.abs(transaction.amount).toFixed(2)}
              </td>
              <td>{transaction.category}</td>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;