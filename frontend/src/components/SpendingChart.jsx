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
import { Card, Table, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SpendingChart = ({ transactions }) => {
  const categories = ["Groceries", "Dining", "Entertainment", "Rent", "Utilities", "Other"];

  const colors = [
    "rgba(75, 192, 192, 0.6)",  // Groceries
    "rgba(255, 99, 132, 0.6)",  // Dining
    "rgba(255, 206, 86, 0.6)",  // Entertainment
    "rgba(153, 102, 255, 0.6)", // Rent
    "rgba(54, 162, 235, 0.6)",  // Utilities
    "rgba(201, 203, 207, 0.6)", // Other
  ];

  // Only use `transactions` (not `recurringTransactions`) to avoid double counting
  const categoryTotals = categories.map((category) =>
    transactions
      .filter((txn) => txn.category === category)
      .reduce((acc, txn) => acc + parseFloat(txn.amount), 0)
  );

  // Calculate total spending, use reduce to iterate through each and make one value
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
        backgroundColor: colors,
        borderRadius: 5,
      },
    ],
  };

  // Refresh Page
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <Card className="p-4 mt-3 shadow-sm rounded">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">📊 Spending Trends</h2>
        <Button variant="outline-secondary" size="sm" onClick={refreshPage} title="Refresh">
          <i className="bi bi-arrow-clockwise"></i> 
        </Button>
      </div>
      
      <Bar data={data} />
      {/*percentage table*/}
      <div className="responsive-table mt-4">
        <Table striped bordered hover className="text-center align-middle">
          <thead className="table-primary">
            <tr>
              {/*iterate through all the categorys*/}
              {categories.map((category, index) => (
                <th key={index}>{category}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {categoryPercentages.map((percentage, index) => (
                <td key={index} className="fw-bold">{percentage}</td>
              ))}
            </tr>
          </tbody>
        </Table>
      </div>
      
      {/*iterate through all the categorys*/}

      <style>
        {`
          .responsive-table {
            overflow-x: auto;              
          }

          .responsive-table table {
            width: 100%;
            min-width: 600px;              
            transition: width 0.3s ease;   
          }

          @media (max-width: 992px) {
            .responsive-table table {
              width: 90% !important;       
              font-size: 0.9rem;
            }
          }

          @media (max-width: 768px) {
            .responsive-table table {
              width: 80% !important;       
              font-size: 0.85rem;
            }
          }

          @media (max-width: 576px) {
            .responsive-table table {
              width: 100% !important;      
              min-width: 400px;
              font-size: 0.75rem;
            }
          }
        `}
      </style>
    </Card>
  );
};

export default SpendingChart;
