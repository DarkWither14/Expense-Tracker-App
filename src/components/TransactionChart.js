import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const TransactionChart = ({ transactions }) => {
  // Skip visualization if no transactions
  if (!transactions || transactions.length === 0) {
    return <div>Add transactions to see visualizations</div>;
  }

  // Prepare data for bar chart - showing recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 5)
    .map(transaction => ({
      name: transaction.description.length > 10 
        ? transaction.description.substring(0, 10) + '...' 
        : transaction.description,
      amount: transaction.type === "expense" ? -transaction.amount : transaction.amount,
    }));

  // Prepare data for pie chart - aggregating by category
  const expenseCategoryData = {};
  const incomeCategoryData = {};
  
  transactions.forEach(transaction => {
    const category = transaction.category || "Uncategorized";
    
    if (transaction.type === "expense") {
      if (!expenseCategoryData[category]) expenseCategoryData[category] = 0;
      expenseCategoryData[category] += transaction.amount;
    } else if (transaction.type === "income") {
      if (!incomeCategoryData[category]) incomeCategoryData[category] = 0;
      incomeCategoryData[category] += transaction.amount;
    }
  });

  // Convert to array format for recharts
  const expensePieData = Object.entries(expenseCategoryData).map(([name, value]) => ({
    name,
    value,
    type: "expense"
  }));
  
  const incomePieData = Object.entries(incomeCategoryData).map(([name, value]) => ({
    name,
    value,
    type: "income"
  }));

  // Colors for pie chart 
  const EXPENSE_COLORS = ['#FF0000', '#FF3333', '#FF6666', '#FF9999', '#FFCCCC', '#FF5733'];
  const INCOME_COLORS = ['#00C853', '#33D975', '#66E398', '#99ECBB', '#CCFFDD', '#4CAF50'];

  return (
    <div className="charts-container">
      <div className="chart">
        <h3>Recent Transactions</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={recentTransactions}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${Math.abs(value).toFixed(2)}`, 'Amount']} />
            <Legend />
            <Bar dataKey="amount" fill={(entry) => entry.amount >= 0 ? '#82ca9d' : '#ff7a7a'} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {expensePieData.length > 0 && (
        <div className="chart">
          <h3>Expense Distribution by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expensePieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#FF0000"
                dataKey="value"
              >
                {expensePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value.toFixed(2)}`]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {incomePieData.length > 0 && (
        <div className="chart">
          <h3>Income Distribution by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomePieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#00C853"
                dataKey="value"
              >
                {incomePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value.toFixed(2)}`]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TransactionChart;