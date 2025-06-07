import React, { createContext, useState, useEffect, useCallback } from "react";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem("transactions");
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = useCallback((transaction) => {
    setTransactions((prevTransactions) => [
      ...prevTransactions,
      { ...transaction, id: Date.now() },
    ]);
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction.id !== id)
    );
  }, []);

  const importTransactions = useCallback((newTransactions) => {
    setTransactions(newTransactions);
  }, []);

  const getBalance = useCallback(() => {
    return transactions.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2);
  }, [transactions]);

  // Function to handle recurring transactions
  const processRecurringTransactions = useCallback(() => {
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
  }, [transactions, addTransaction]);

  // Check for recurring transactions daily
  useEffect(() => {
    processRecurringTransactions();
    const interval = setInterval(processRecurringTransactions, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [processRecurringTransactions]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        importTransactions,
        getBalance,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
