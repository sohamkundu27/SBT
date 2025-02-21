import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import SpendingChart from "./components/SpendingChart";
import BudgetOverview from "./components/BudgetOverview";
import RecurringTransactionList from "./components/RecurringTransactionList";
import axios from "axios";

const App = () => {
  const [transactions, setTransactions] = useState([]); //arrays of all transactions
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [budget, setBudget] = useState(1000); // Default budget

  // Fetch transactions and recurring transactions when the app first loads
  useEffect(() => {
    fetchAllData();
    fetchBudgets();
  }, []);

  const fetchAllData = async () => {
    await fetchTransactions();
    await fetchRecurringTransactions();
  };

  // Fetch Regular Transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5054/api/get-all");

      if (!Array.isArray(response.data)) {
        console.error("API did not return an array:", response.data);
        return;
      }

      setTransactions(response.data); // Overwrite instead of adding duplicates
      console.log("Transactions loaded:", response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  //Fetch Recurring Transactions
  const fetchRecurringTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5054/api/recurring/get-all");
      setRecurringTransactions(response.data);
      console.log("Recurring Transactions loaded:", response.data);
    } catch (error) {
      console.error("Error fetching recurring transactions:", error);
    }
  };

  // Add a New Transaction using FormData
  const addTransaction = async (transaction) => {
    try {
        const form = new FormData();
        form.append("description", transaction.description);
        form.append("amount", transaction.amount);
        form.append("category", transaction.category || "Other");
        form.append("isRecurring", transaction.isRecurring ? "true" : "false");
        form.append("frequency", transaction.frequency || "");

        const apiEndpoint = transaction.isRecurring
            ? "http://localhost:5054/api/recurring/add"
            : "http://localhost:5054/api/add";

        //Add the new transaction
        await axios.post(apiEndpoint, form);
        console.log("Transaction added:", transaction);

        // Fetch updated transactions
        const response = await axios.get("http://localhost:5054/api/get-all");
        const transactions = response.data;

        if (transactions.length > 1) {
            // Get the most recent transaction (assuming last one is newest)
            //logic if there's a duplicate
            const mostRecentTransaction = transactions[transactions.length - 2]; // Get second-last (since last is the new one)

            console.log("Attempting to delete duplicate:", mostRecentTransaction);

            // Delete the most recent transaction using the existing function
            await deleteTransaction(mostRecentTransaction.id);

            console.log("Deleted duplicate transaction:", mostRecentTransaction);
        }

        window.location.reload(); // refresh
    } catch (error) {
        console.error("Error adding or deleting transaction:", error);
    }
};


  // Delete a Transaction using FormData
  // Formdata packages the data before sending it to axios
  const deleteTransaction = async (id) => {
    try {
      const form = new FormData();
      form.append("id", id);

      await axios.post("http://localhost:5054/api/delete", form);
      window.location.reload(); // Refresh the page after deleting
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Delete Recurring Transaction using FormData
  const deleteRecurringTransaction = async (id) => {
    try {
      const form = new FormData();
      form.append("id", id);

      await axios.post("http://localhost:5054/api/recurring/delete", form);
      window.location.reload(); // Refresh the page after deleting
    } catch (error) {
      console.error(" Error deleting recurring transaction:", error);
    }
  };

  // Delete All Transactions and reset state properly
  const deleteAllTransactions = () => {
    setTransactions([]);
    setRecurringTransactions([]);
    window.location.reload(); // Refresh the page after deleting all
  };
  const fetchBudgets = async () => {
    try {
        const response = await axios.get("http://localhost:5054/api/budgets/get-all");
        setBudgets(response.data);
        console.log("Budgets loaded:", response.data);
    } catch (error) {
        console.error("Error fetching budgets:", error);
    }
};

  // Merge Regular and Recurring Transactions for Overview & Chart
  const allTransactions = [...transactions, ...recurringTransactions];

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Smart Budget Tracker</h1>

      <div className="mb-3">
        <BudgetOverview budget={budget} transactions={allTransactions} /> {/* Merged Transactions for the overview and chart*/}
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
        <SpendingChart transactions={allTransactions} /> {/*merged transactions */}
      </div>
    </Container>
  );
};

export default App;
