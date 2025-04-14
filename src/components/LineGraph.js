import React, { useContext } from "react";
import { Line } from "react-chartjs-2";
import { TransactionContext } from "../contexts/TransactionContext";
import { 
  Chart as ChartJS, 
  LineElement, 
  CategoryScale, 
  LinearScale, 
  PointElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from "chart.js";

// Register all necessary chart components
ChartJS.register(
  LineElement, 
  CategoryScale, 
  LinearScale, 
  PointElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const LineGraph = () => {
  const { transactions } = useContext(TransactionContext);

  // Group transactions by month
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const incomeData = new Array(12).fill(0);
  const expenseData = new Array(12).fill(0);

  transactions.forEach((transaction) => {
    if (transaction.date) {
      const month = new Date(transaction.date).getMonth();
      if (transaction.type === "income") {
        incomeData[month] += Math.abs(transaction.amount);
      } else {
        expenseData[month] += Math.abs(transaction.amount);
      }
    }
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income vs Expense Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Line chart data
  const data = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0.4
      },
      {
        label: "Expense",
        data: expenseData,
        borderColor: "#FF5733",
        backgroundColor: "rgba(255, 87, 51, 0.2)",
        fill: true,
        tension: 0.4
      },
    ],
  };

  return (
    <div className="line-graph">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineGraph;
