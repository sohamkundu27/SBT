import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, Table } from "react-bootstrap";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SpendingChart = ({ transactions }) => {
  const categories = ["Groceries", "Dining", "Entertainment", "Rent", "Utilities", "Other"];

  // Calculate total spending per category
  const categoryTotals = categories.map((category) =>
    transactions
      .filter((txn) => txn.category === category)
      .reduce((acc, txn) => acc + parseFloat(txn.amount), 0)
  );

  // Calculate total spending
  const totalSpent = categoryTotals.reduce((acc, amount) => acc + amount, 0);

  // Calculate percentage per category
  const categoryPercentages = categoryTotals.map((amount) =>
    totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(2) + "%" : "0%"
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

      {/* Spending Table with Categories on Top */}
      <Table striped bordered hover className="mt-3 text-center">
        <thead>
          <tr>
            {categories.map((category, index) => (
              <th key={index}>{category}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {categoryPercentages.map((percentage, index) => (
              <td key={index}>{percentage}</td>
            ))}
          </tr>
        </tbody>
      </Table>
    </Card>
  );
};

export default SpendingChart;
