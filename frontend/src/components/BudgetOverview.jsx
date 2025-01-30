import React, { useState, useEffect } from "react";
import { Card, Table, Form, Button, Alert } from "react-bootstrap";

const BudgetOverview = ({ transactions }) => {
  const categories = ["Groceries", "Dining", "Entertainment", "Rent", "Utilities", "Other"];

  // State to store user-defined category budgets (default = $100 per category)
  const [categoryBudgets, setCategoryBudgets] = useState(
    categories.reduce((acc, category) => ({ ...acc, [category]: 100 }), {})
  );

  // State to track input values before setting budgets
  const [inputValues, setInputValues] = useState({ ...categoryBudgets });

  // State to track disabled status of inputs
  const [isDisabled, setIsDisabled] = useState(
    categories.reduce((acc, category) => ({ ...acc, [category]: false }), {})
  );

  // State to store overspending alerts
  const [overspendingAlerts, setOverspendingAlerts] = useState([]);

  // Compute spending per category
  const categorySpending = categories.reduce((acc, category) => {
    acc[category] = transactions
      .filter((txn) => txn.category === category)
      .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);
    return acc;
  }, {});

  // Handle budget input changes
  const handleInputChange = (category, value) => {
    setInputValues({ ...inputValues, [category]: parseFloat(value) || 0 });
  };

  // Set budget when clicking the Set button
  const handleSetBudget = (category) => {
    setCategoryBudgets({ ...categoryBudgets, [category]: inputValues[category] });
    setIsDisabled({ ...isDisabled, [category]: true }); // Disable input
  };

  // Reset budget to default ($100)
  const handleResetBudget = (category) => {
    setCategoryBudgets({ ...categoryBudgets, [category]: 100 });
    setInputValues({ ...inputValues, [category]: 100 });
    setIsDisabled({ ...isDisabled, [category]: false }); // Enable input
  };

  // Check for overspending and update alerts
  useEffect(() => {
    const newAlerts = categories
      .filter((category) => categorySpending[category] > (categoryBudgets[category] || 0))
      .map((category) => `⚠️ You have exceeded your budget for ${category}!`);
    
    setOverspendingAlerts(newAlerts);
  }, [transactions, categoryBudgets]);

  return (
    <Card className="p-4 mt-3">
      <h2>Budget Overview</h2>

      {/* Display Overspending Alerts */}
      {overspendingAlerts.length > 0 && (
        <Alert variant="danger">
          {overspendingAlerts.map((alert, index) => (
            <div key={index}>{alert}</div>
          ))}
        </Alert>
      )}

      {/* Budget Input Form */}
      <Form className="mb-3">
        {categories.map((category) => (
          <Form.Group key={category} className="mb-2 d-flex align-items-center">
            <Form.Label className="me-2">{category} Budget ($)</Form.Label>
            <Form.Control
              type="number"
              value={inputValues[category]}
              onChange={(e) => handleInputChange(category, e.target.value)}
              className="me-2"
              style={{
                width: "120px",
                backgroundColor: isDisabled[category] ? "#e9ecef" : "white", // Gray if disabled
              }}
              disabled={isDisabled[category]} // Disable input
            />
            <Button variant="success" size="sm" onClick={() => handleSetBudget(category)} disabled={isDisabled[category]}>
              Set
            </Button>
            <Button variant="danger" size="sm" className="ms-2" onClick={() => handleResetBudget(category)}>
              Reset
            </Button>
          </Form.Group>
        ))}
      </Form>

      {/* Budget Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Category</th>
            <th>Budget ($)</th>
            <th>Spent ($)</th>
            <th>Remaining ($)</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => {
            const budget = categoryBudgets[category] || 0;
            const spent = categorySpending[category] || 0;
            const remaining = budget - spent;

            return (
              <tr key={category}>
                <td>{category}</td>
                <td>${budget.toFixed(2)}</td>
                <td className={spent > budget ? "text-danger" : "text-success"}>
                  ${spent.toFixed(2)}
                </td>
                <td className={remaining < 0 ? "text-danger" : "text-success"}>
                  ${remaining.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Card>
  );
};

export default BudgetOverview;
