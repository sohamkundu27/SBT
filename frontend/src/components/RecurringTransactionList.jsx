import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios"; // use for api calls
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons

const RecurringTransactionList = () => {
  const [recurringTransactions, setRecurringTransactions] = useState([]);

  // Fetch Recurring Transactions from the DB
    useEffect(() => {
    fetchRecurringTransactions();
  }, []);

  const fetchRecurringTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5054/api/recurring/get-all");
      const transactionsWithIds = response.data.map((txn) => ({
        ...txn,
        id: txn.id || Date.now() + Math.random(), // Ensure unique ID
      }));
      setRecurringTransactions(transactionsWithIds);
      console.log("Recurring Transactions loaded:", transactionsWithIds);
    } catch (error) {
      console.error("Error fetching recurring transactions:", error);
    }
  };

  // Delete Recurring Transaction
  const deleteRecurringTransaction = async (id) => {
    try {
      const form = new FormData();
      form.append("id", id);

      await axios.post("http://localhost:5054/api/recurring/delete", form);
      //find the correct id to remove with filter
      setRecurringTransactions((prev) => prev.filter((txn) => txn.id !== id));
      console.log(`Deleted recurring transaction with ID: ${id}`);
    } catch (error) {
      console.error("Error deleting recurring transaction:", error);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="card p-4 mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Recurring Transactions</h2>
        <Button variant="outline-secondary" size="sm" onClick={refreshPage} title="Refresh">
          <i className="bi bi-arrow-clockwise"></i> 
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount ($)</th>
            <th>Category</th>
            <th>Frequency</th>
            <th>Date Created</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {recurringTransactions.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No recurring transactions yet.</td>
            </tr>
          ) : (
            recurringTransactions.map((txn) => (
              //iterate through recurringTransactions and display them all 
              <tr key={txn.id}>
                <td>{txn.description}</td>
                <td>${txn.amount.toFixed(2)}</td>
                <td>{txn.category}</td>
                <td>{txn.frequency}</td>
                <td>{txn.dateCreated ? new Date(txn.dateCreated).toLocaleDateString() : "N/A"}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => deleteRecurringTransaction(txn.id)}>
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

export default RecurringTransactionList;
