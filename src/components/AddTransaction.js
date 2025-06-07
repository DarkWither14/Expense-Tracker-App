import React, { useState, useContext } from "react";
import { TransactionContext } from "../contexts/TransactionContext";
import { LocaleContext } from "../contexts/LocaleContext";
import "./AddTransaction.css";

const categories = ["Food", "Transport", "Entertainment", "Utilities", "Miscellaneous"];

const AddTransaction = () => {
  const { addTransaction } = useContext(TransactionContext);
  const { t } = useContext(LocaleContext);
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
      id: Date.now()
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
      <div className="form-group">
        <label htmlFor="type">{t('type')}</label>
        <select 
          id="type"
          value={type} 
          onChange={(e) => setType(e.target.value)}
        >
          <option value="expense">{t('expense')}</option>
          <option value="income">{t('income')}</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">{t('description')}</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">{t('amount')}</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0"
          step="0.01"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">{t('category')}</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">{t('selectCategory')}</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="date">{t('date')}</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <button type="submit">{t('addTransaction')}</button>
    </form>
  );
};

export default AddTransaction;