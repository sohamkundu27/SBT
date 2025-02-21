import React from "react";
import { Table, Button } from "react-bootstrap";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "bootstrap-icons/font/bootstrap-icons.css";

const TransactionList = ({ transactions, onDeleteTransaction }) => {
  
  // Refresh the page
  const refreshPage = () => {
    window.location.reload();
  };

  // Export transactions as CSV
  const exportToCSV = () => {
    const csvContent = [
      ["Description", "Amount ($)", "Category", "Date Created"],
      ...transactions.map(txn => [
        txn.description,
        txn.amount,
        txn.category,
        new Date(txn.date).toLocaleDateString()
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "transactions.csv");
  };

  // Export transactions as JSON
  const exportToJSON = () => {
    const jsonData = JSON.stringify(transactions, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    saveAs(blob, "transactions.json");
  };

  // Export transactions as PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Transaction History", 20, 10);
    
    const tableColumn = ["Description", "Amount ($)", "Category", "Date Created"];
    const tableRows = transactions.map(txn => [
      txn.description,
      `$${txn.amount}`,
      txn.category,
      new Date(txn.date).toLocaleDateString()
    ]);

    doc.autoTable({ head: [tableColumn], body: tableRows });
    doc.save("transactions.pdf");
  };

  return (
    <div className="card p-4 mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Transaction History</h2>
        <Button variant="outline-secondary" size="sm" onClick={refreshPage} title="Refresh">
          <i className="bi bi-arrow-clockwise"></i> 
        </Button>
      </div>

      <div className="mb-3 d-flex justify-content-center gap-2">
        <Button variant="success" size="sm" onClick={exportToCSV}>Export CSV</Button>
        <Button variant="info" size="sm" onClick={exportToJSON}>Export JSON</Button>
        <Button variant="primary" size="sm" onClick={exportToPDF}>Export PDF</Button>
      </div>

      {/* responsive Table */}
      <div style={{ overflowX: "auto" }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount ($)</th>
              <th>Category</th>
              <th>Date Created</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No transactions yet.</td>
              </tr>
            ) : (
              transactions.map((txn) => (
                <tr key={txn.id || Math.random()}>
                  <td>{txn.description}</td>
                  <td className={txn.amount < 0 ? "text-danger" : "black"}>
                    ${parseFloat(txn.amount).toFixed(2)}
                  </td>
                  <td>{txn.category}</td>
                  <td>{new Date(txn.date).toLocaleDateString()}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => onDeleteTransaction(txn.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionList;
