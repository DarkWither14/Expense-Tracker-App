import React, { createContext, useState } from "react";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const getBalance = () => {
    return transactions.reduce((acc, curr) => {
      return curr.type === "expense" 
        ? acc - curr.amount 
        : acc + curr.amount;
    }, 0).toFixed(2);
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, getBalance }}>
      {children}
    </TransactionContext.Provider>
  );
};