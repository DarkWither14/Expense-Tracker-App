import React, { useState, useContext, useEffect } from 'react';
import { TransactionContext } from '../contexts/TransactionContext';
import './BudgetManager.css';

const categories = ["Food", "Transport", "Entertainment", "Utilities", "Miscellaneous"];

const BudgetManager = () => {
  const { transactions } = useContext(TransactionContext);
  const [budgets, setBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : {};
  });
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: '',
    period: 'monthly'
  });

  // Save budgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Calculate current spending for each category
  const calculateCurrentSpending = (category) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(transaction => 
        transaction.type === 'expense' &&
        transaction.category === category &&
        new Date(transaction.date).getMonth() === currentMonth &&
        new Date(transaction.date).getFullYear() === currentYear
      )
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  };

  // Check if budget is approaching or exceeded
  const getBudgetStatus = (category) => {
    const currentSpending = calculateCurrentSpending(category);
    const budget = budgets[category];
    
    if (!budget) return null;
    
    const percentage = (currentSpending / budget) * 100;
    
    if (percentage >= 100) {
      return 'exceeded';
    } else if (percentage >= 80) {
      return 'approaching';
    }
    return 'good';
  };

  const handleAddBudget = (e) => {
    e.preventDefault();
    setBudgets(prev => ({
      ...prev,
      [newBudget.category]: parseFloat(newBudget.amount)
    }));
    setNewBudget({
      category: '',
      amount: '',
      period: 'monthly'
    });
  };

  const handleDeleteBudget = (category) => {
    setBudgets(prev => {
      const newBudgets = { ...prev };
      delete newBudgets[category];
      return newBudgets;
    });
  };

  return (
    <div className="budget-manager">
      <h2>Budget Management</h2>
      
      <form onSubmit={handleAddBudget} className="budget-form">
        <div className="form-group">
          <label>Category:</label>
          <select
            value={newBudget.category}
            onChange={(e) => setNewBudget(prev => ({ ...prev, category: e.target.value }))}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Budget Amount:</label>
          <input
            type="number"
            value={newBudget.amount}
            onChange={(e) => setNewBudget(prev => ({ ...prev, amount: e.target.value }))}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label>Period:</label>
          <select
            value={newBudget.period}
            onChange={(e) => setNewBudget(prev => ({ ...prev, period: e.target.value }))}
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <button type="submit">Add Budget</button>
      </form>

      <div className="budget-list">
        <h3>Current Budgets</h3>
        {Object.entries(budgets).map(([category, amount]) => {
          const currentSpending = calculateCurrentSpending(category);
          const status = getBudgetStatus(category);
          const percentage = (currentSpending / amount) * 100;

          return (
            <div key={category} className={`budget-item ${status}`}>
              <div className="budget-header">
                <h4>{category}</h4>
                <button onClick={() => handleDeleteBudget(category)}>Delete</button>
              </div>
              <div className="budget-details">
                <p>Budget: ${amount}</p>
                <p>Spent: ${currentSpending.toFixed(2)}</p>
                <p>Remaining: ${(amount - currentSpending).toFixed(2)}</p>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                {status === 'exceeded' && (
                  <p className="warning">Budget exceeded!</p>
                )}
                {status === 'approaching' && (
                  <p className="warning">Approaching budget limit!</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetManager; 