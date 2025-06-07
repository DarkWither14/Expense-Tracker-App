import React, { useState, useEffect, useContext } from 'react';
import { TransactionContext } from '../contexts/TransactionContext';
import './NotificationManager.css';

const NotificationManager = () => {
  const { transactions } = useContext(TransactionContext);
  const [notifications, setNotifications] = useState([]);
  const [reminders, setReminders] = useState(() => {
    const savedReminders = localStorage.getItem('reminders');
    return savedReminders ? JSON.parse(savedReminders) : [];
  });

  // Save reminders to localStorage
  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Check for upcoming bills and budget limits
  useEffect(() => {
    const checkUpcomingBills = () => {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const upcomingBills = reminders.filter(reminder => {
        const reminderDate = new Date(reminder.date);
        return reminderDate >= today && reminderDate <= nextWeek;
      });

      if (upcomingBills.length > 0) {
        addNotification({
          type: 'reminder',
          message: `You have ${upcomingBills.length} upcoming bill(s) in the next week`,
          date: new Date()
        });
      }
    };

    const checkBudgetLimits = () => {
      const budgets = JSON.parse(localStorage.getItem('budgets') || '{}');
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      Object.entries(budgets).forEach(([category, limit]) => {
        const spent = transactions
          .filter(t => 
            t.type === 'expense' && 
            t.category === category &&
            new Date(t.date).getMonth() === currentMonth &&
            new Date(t.date).getFullYear() === currentYear
          )
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const percentage = (spent / limit) * 100;
        if (percentage >= 80 && percentage < 100) {
          addNotification({
            type: 'budget',
            message: `You've used ${percentage.toFixed(1)}% of your ${category} budget`,
            date: new Date()
          });
        }
      });
    };

    // Check daily
    checkUpcomingBills();
    checkBudgetLimits();

    // Set up daily checks
    const dailyCheck = setInterval(() => {
      checkUpcomingBills();
      checkBudgetLimits();
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(dailyCheck);
  }, [transactions, reminders]);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 10)); // Keep last 10 notifications
  };

  const addReminder = (reminder) => {
    setReminders(prev => [...prev, { ...reminder, id: Date.now() }]);
  };

  const removeReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const removeNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="notification-manager">
      <div className="reminders-section">
        <h3>Bill Reminders</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          addReminder({
            title: formData.get('title'),
            amount: parseFloat(formData.get('amount')),
            date: formData.get('date'),
            category: formData.get('category')
          });
          e.target.reset();
        }}>
          <div className="form-group">
            <label>Title:</label>
            <input type="text" name="title" required />
          </div>
          <div className="form-group">
            <label>Amount:</label>
            <input type="number" name="amount" step="0.01" required />
          </div>
          <div className="form-group">
            <label>Due Date:</label>
            <input type="date" name="date" required />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select name="category" required>
              <option value="Utilities">Utilities</option>
              <option value="Rent">Rent</option>
              <option value="Subscriptions">Subscriptions</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button type="submit">Add Reminder</button>
        </form>

        <div className="reminders-list">
          {reminders.map(reminder => (
            <div key={reminder.id} className="reminder-item">
              <div className="reminder-info">
                <h4>{reminder.title}</h4>
                <p>Amount: ${reminder.amount}</p>
                <p>Due: {new Date(reminder.date).toLocaleDateString()}</p>
                <p>Category: {reminder.category}</p>
              </div>
              <button 
                onClick={() => removeReminder(reminder.id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="notifications-section">
        <h3>Recent Notifications</h3>
        <div className="notifications-list">
          {notifications.map((notification, index) => (
            <div 
              key={index} 
              className={`notification-item ${notification.type}`}
            >
              <p>{notification.message}</p>
              <small>{new Date(notification.date).toLocaleString()}</small>
              <button 
                onClick={() => removeNotification(index)}
                className="remove-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationManager; 