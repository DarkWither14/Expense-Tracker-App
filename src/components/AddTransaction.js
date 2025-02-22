import React, { useState, useContext } from "react";
import { TransactionContext } from "../contexts/TransactionContext";

const categories = ["Food", "Transport", "Entertainment", "Utilities", "Miscellaneous"];

const AddTransaction = () => {
  const { addTransaction } = useContext(TransactionContext);
  const [type, setType] = useState("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = { 
      type, 
      description, 
      amount: parseFloat(amount), 
      category, 
      date,
      id: Date.now() // Add unique ID for each transaction
    };
    addTransaction(newTransaction);
    setType("expense");
    setDescription("");
    setAmount("");
    setCategory("");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <label>
        Type:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </label>

      <label>
        Description:
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>

      <label>
        Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0"
          step="0.01"
        />
      </label>

      <label>
        Category:
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </label>

      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      <button type="submit">Add Transaction</button>
    </form>
  );
};

export default AddTransaction;