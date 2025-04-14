import React, { createContext, useState, useEffect } from "react";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      amount: transaction.type === "expense" ? -Math.abs(transaction.amount) : Math.abs(transaction.amount)
    };
    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
  };

  const getBalance = () => {
    return transactions.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2);
  };

  // Function to handle recurring transactions
  const processRecurringTransactions = () => {
    const today = new Date().toISOString().split('T')[0];
    transactions.forEach(transaction => {
      if (transaction.isRecurring && transaction.nextDate === today) {
        // Create a new transaction for today
        const newTransaction = {
          ...transaction,
          id: Date.now(),
          date: today
        };
        addTransaction(newTransaction);

        // Update the next date based on frequency
        const nextDate = new Date(today);
        switch (transaction.frequency) {
          case 'daily':
            nextDate.setDate(nextDate.getDate() + 1);
            break;
          case 'weekly':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
          case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
          case 'yearly':
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
          default:
            break;
        }
        transaction.nextDate = nextDate.toISOString().split('T')[0];
      }
    });
  };

  // Check for recurring transactions daily
  useEffect(() => {
    processRecurringTransactions();
    const interval = setInterval(processRecurringTransactions, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [transactions]);

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, getBalance }}>
      {children}
    </TransactionContext.Provider>
  );
};
