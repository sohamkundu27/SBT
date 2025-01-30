import React, { useState } from "react";
import { Container } from "react-bootstrap";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import SpendingChart from "./components/SpendingChart";
import BudgetOverview from "./components/BudgetOverview";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(1000); // Default budget (adjust as needed)

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Smart Budget Tracker</h1>
      <BudgetOverview budget={budget} transactions={transactions} />
      <TransactionForm onAddTransaction={addTransaction} />
      <TransactionList transactions={transactions} />
      <SpendingChart transactions={transactions} />
    </Container>
  );
};

export default App;
