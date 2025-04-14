import React, { useContext } from "react";
import { Pie } from "react-chartjs-2";
import { TransactionContext } from "../contexts/TransactionContext";
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  CategoryScale, 
  LinearScale 
} from "chart.js";
import './PieChart.css';  // If using a separate CSS file

// Registering chart.js components
ChartJS.register(
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  CategoryScale, 
  LinearScale
);

const PieChart = () => {
  const { transactions } = useContext(TransactionContext);

  // Group expenses by category
  const categoryData = transactions
    .filter(transaction => transaction.type === "expense")
    .reduce((acc, curr) => {
      const category = curr.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + Math.abs(curr.amount);
      return acc;
    }, {});

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Spending by Category'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: $${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Prepare data for the pie chart
  const data = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Spending by Category",
        data: Object.values(categoryData),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
          "#FF9F40", "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"
        ],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="pie-chart-container">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
