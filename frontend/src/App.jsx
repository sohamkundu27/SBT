import React, { useState } from "react";
import { Container } from "react-bootstrap";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import SpendingChart from "./components/SpendingChart";
import BudgetOverview from "./components/BudgetOverview";
import axios from 'axios'

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(1000); // Default budget

  const addTransaction = (transaction) => {
    const newTransaction = { ...transaction, date: new Date().toISOString() }; // Add current date
    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
  };

  const deleteTransaction = async (id, index) => {
    console.log(id);
    const form = new FormData();
    form.append("id", id);
    const response = await axios.post("https://localhost:7224/api/delete", form);
    console.log(response.data);
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const deleteAllTransaction = () => {
    setTransactions([]);
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Smart Budget Tracker</h1>
      
      <div className="mb-3">
        <BudgetOverview budget={budget} transactions={transactions} />
      </div>

      <div className="mb-3">
        <TransactionForm transactions={transactions} onAddTransaction={addTransaction} onDeleteTransactions={deleteAllTransaction}/>
      </div>

      <div className="mb-3">
        <TransactionList transactions={transactions} onDeleteTransaction={deleteTransaction} />
      </div>

      <div className="mb-3">
        <SpendingChart transactions={transactions} />
      </div>
    </Container>
  );
};

export default App;
