import React, { useContext } from "react";
import { TransactionContext } from "../contexts/TransactionContext";
import "./TransactionList.css"; // Import the CSS file for styling

const TransactionList = () => {
  const { transactions } = useContext(TransactionContext);

  return (
    <div className="transaction-list">
      {transactions.map((transaction, index) => (
        <div
          key={index}
          className={`transaction-item ${transaction.type === "expense" ? "expense" : "income"}`}
        >
          <span>{transaction.description}</span>
          <span>{transaction.amount}</span>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
