import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";

const RecurringTransactionList = () => {
  const [recurringTransactions, setRecurringTransactions] = useState([]);

  // ✅ Fetch Recurring Transactions on Component Mount
  useEffect(() => {
    fetchRecurringTransactions();
  }, []);

  const fetchRecurringTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5054/api/recurring/get-all");
      setRecurringTransactions(response.data);
    } catch (error) {
      console.error("❌ Error fetching recurring transactions:", error);
    }
  };

  // ✅ Delete Recurring Transaction
  const deleteRecurringTransaction = async (id) => {
    try {
      const form = new FormData();
      form.append("id", id);

      const response = await axios.post("http://localhost:5054/api/recurring/delete", form);
      setRecurringTransactions(response.data); // ✅ Update the list after deletion
    } catch (error) {
      console.error("❌ Error deleting recurring transaction:", error);
    }
  };

  return (
    <div className="card p-4 mt-3">
      <h2 className="text-center">Recurring Transactions</h2>
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
              <tr key={txn.id}>
                <td>{txn.description}</td>
                <td>${txn.amount.toFixed(2)}</td>
                <td>{txn.category}</td>
                <td>{txn.frequency}</td>
                <td>{new Date(txn.dateCreated).toLocaleDateString()}</td>
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
