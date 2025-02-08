import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import SpendingChart from "./components/SpendingChart";
import BudgetOverview from "./components/BudgetOverview";
import RecurringTransactionList from "./components/RecurringTransactionList";
import axios from "axios";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [budget, setBudget] = useState(1000); // Default budget

  // ✅ Fetch transactions and recurring transactions when the app first loads
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await fetchTransactions();
    await fetchRecurringTransactions();
  };

  // ✅ Fetch Regular Transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5054/api/get-all");
      setTransactions(response.data);
      console.log("📥 Transactions loaded:", response.data);
    } catch (error) {
      console.error("❌ Error fetching transactions:", error);
    }
  };

  // ✅ Fetch Recurring Transactions
  const fetchRecurringTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5054/api/recurring/get-all");
      setRecurringTransactions(response.data);
      console.log("📥 Recurring Transactions loaded:", response.data);
    } catch (error) {
      console.error("❌ Error fetching recurring transactions:", error);
    }
  };

  // ✅ Add a New Transaction
  const addTransaction = async (transaction) => {
    try {
      const form = new FormData();
      form.append("description", transaction.description);
      form.append("amount", transaction.amount);
      form.append("isRecurring", transaction.isRecurring || "false");
      form.append("frequency", transaction.frequency || "");

      const apiEndpoint = transaction.isRecurring
        ? "http://localhost:5054/api/recurring/add"
        : "http://localhost:5054/api/add";

      await axios.post(apiEndpoint, form);
      window.location.reload(); // ✅ Refresh the page after adding
    } catch (error) {
      console.error("❌ Error adding transaction:", error);
    }
  };

  // ✅ Delete a Transaction from the Database
  const deleteTransaction = async (id) => {
    try {
      const form = new FormData();
      form.append("id", id);

      await axios.post("http://localhost:5054/api/delete", form);
      window.location.reload(); // ✅ Refresh the page after deleting
    } catch (error) {
      console.error("❌ Error deleting transaction:", error);
    }
  };

  // ✅ Delete Recurring Transaction
  const deleteRecurringTransaction = async (id) => {
    try {
      const form = new FormData();
      form.append("id", id);

      await axios.post("http://localhost:5054/api/recurring/delete", form);
      window.location.reload(); // ✅ Refresh the page after deleting
    } catch (error) {
      console.error("❌ Error deleting recurring transaction:", error);
    }
  };

  // ✅ Delete All Transactions (Frontend Only)
  const deleteAllTransactions = () => {
    setTransactions([]);
    setRecurringTransactions([]);
    window.location.reload(); // ✅ Refresh the page after deleting all
  };

  // ✅ Merge Regular and Recurring Transactions for Overview & Chart
  const allTransactions = [...transactions, ...recurringTransactions];

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Smart Budget Tracker</h1>

      <div className="mb-3">
        <BudgetOverview budget={budget} transactions={allTransactions} /> {/* ✅ Merged Transactions */}
      </div>

      <div className="mb-3">
        <TransactionForm
          transactions={allTransactions}
          onAddTransaction={addTransaction}
          onDeleteTransactions={deleteAllTransactions}
        />
      </div>

      <div className="mb-3">
        <TransactionList
          transactions={transactions}
          onDeleteTransaction={deleteTransaction}
        />
      </div>

      <div className="mb-3">
        <RecurringTransactionList
          recurringTransactions={recurringTransactions}
          onDeleteRecurringTransaction={deleteRecurringTransaction}
        />
      </div>

      <div className="mb-3">
        <SpendingChart transactions={allTransactions} /> {/* ✅ Merged Transactions */}
      </div>
    </Container>
  );
};

export default App;