import React from "react";
import { Table, Button } from "react-bootstrap";
import { saveAs } from "file-saver"; // For exporting files
import jsPDF from "jspdf"; // For PDF generation
import "jspdf-autotable"; // For table formatting in PDF

const TransactionList = ({ transactions, onDeleteTransaction }) => {
  
  // Export transactions as CSV
  const exportToCSV = () => {
    const csvContent = [
      ["Description", "Amount ($)", "Category", "Date Created"], // CSV Headers
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
      <h2 className="mb-3">Transaction History</h2>

      {/* Export Buttons */}
      <div className="mb-3 d-flex gap-2">
        <Button variant="success" size="sm" onClick={exportToCSV}>Export CSV</Button>
        <Button variant="info" size="sm" onClick={exportToJSON}>Export JSON</Button>
        <Button variant="primary" size="sm" onClick={exportToPDF}>Export PDF</Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Amount ($)</th>
            <th>Category</th>
            <th>Date Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No transactions yet.</td>
            </tr>
          ) : (
            transactions.map((txn, index) => (
              <tr key={index}>
                <td>{txn.id}</td>
                <td>{txn.description}</td>
                <td className={txn.amount < 0 ? "text-danger" : "text-success"}>
                  ${txn.amount}
                </td>
                <td>{txn.category}</td>
                <td>{new Date(txn.date).toLocaleDateString()}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => onDeleteTransaction(txn.id, index)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TransactionList;
