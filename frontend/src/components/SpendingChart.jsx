import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Card } from "react-bootstrap";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SpendingChart = ({ transactions }) => {
  const categories = ["Groceries", "Dining", "Entertainment", "Rent", "Utilities", "Other"];
  const categoryTotals = categories.map((category) =>
    transactions
      .filter((txn) => txn.category === category)
      .reduce((acc, txn) => acc + parseFloat(txn.amount), 0)
  );

  const data = {
    labels: categories,
    datasets: [
      {
        label: "Spending ($)",
        data: categoryTotals,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <Card className="p-4 mt-3">
      <h2>Spending Trends</h2>
      <Bar data={data} />
    </Card>
  );
};

export default SpendingChart;
