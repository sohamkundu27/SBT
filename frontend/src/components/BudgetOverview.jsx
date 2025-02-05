import React, { useState, useEffect } from "react";
import { Card, Accordion, Form, Button, Alert, Row, Col } from "react-bootstrap";

const BudgetOverview = ({ transactions }) => {
  const categories = ["Groceries", "Dining", "Entertainment", "Rent", "Utilities", "Other"];

  const [categoryBudgets, setCategoryBudgets] = useState(
    categories.reduce((acc, category) => ({ ...acc, [category]: 100 }), {})
  );
  const [inputValues, setInputValues] = useState({ ...categoryBudgets });
  const [isDisabled, setIsDisabled] = useState(
    categories.reduce((acc, category) => ({ ...acc, [category]: false }), {})
  );
  const [overspendingAlerts, setOverspendingAlerts] = useState([]);

  // ✅ Calculate total spending per category
  const categorySpending = categories.reduce((acc, category) => {
    acc[category] = transactions
      .filter((txn) => txn.category === category)
      .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);
    return acc;
  }, {});

  const handleInputChange = (category, value) => {
    setInputValues({ ...inputValues, [category]: parseFloat(value) || 0 });
  };

  const handleSetBudget = (category) => {
    setCategoryBudgets({ ...categoryBudgets, [category]: inputValues[category] });
    setIsDisabled({ ...isDisabled, [category]: true });
  };

  const handleResetBudget = (category) => {
    setCategoryBudgets({ ...categoryBudgets, [category]: 100 });
    setInputValues({ ...inputValues, [category]: 100 });
    setIsDisabled({ ...isDisabled, [category]: false });
  };

  const handleClearBudget = (category) => {
    setCategoryBudgets({ ...categoryBudgets, [category]: 0 });
    setInputValues({ ...inputValues, [category]: 0 });
    setIsDisabled({ ...isDisabled, [category]: false });
  };

  // ✅ Alert for overspending
  useEffect(() => {
    const newAlerts = categories
      .filter((category) => categorySpending[category] > (categoryBudgets[category] || 0))
      .map((category) => `⚠️ You have exceeded your budget for ${category}!`);

    setOverspendingAlerts(newAlerts);
  }, [transactions, categoryBudgets]);

  return (
    <Card className="p-3 mt-3 shadow-sm rounded">
      <h2 className="text-center">📊 Budget Overview</h2>

      {/* ✅ Overspending Alerts */}
      {overspendingAlerts.length > 0 && (
        <Alert variant="danger" className="text-center">
          {overspendingAlerts.map((alert, index) => (
            <div key={index}>{alert}</div>
          ))}
        </Alert>
      )}

      {/* ✅ Mobile View: Accordion */}
      <Accordion defaultActiveKey="0" className="d-md-none">
        {categories.map((category, index) => {
          const budget = categoryBudgets[category] || 0;
          const spent = categorySpending[category] || 0;
          const remaining = budget - spent;

          return (
            <Accordion.Item eventKey={index.toString()} key={category}>
              <Accordion.Header>{category}</Accordion.Header>
              <Accordion.Body>
                <Form.Group className="mb-2">
                  <Form.Label>Set Budget ($)</Form.Label>
                  <Form.Control
                    type="number"
                    value={inputValues[category]}
                    onChange={(e) => handleInputChange(category, e.target.value)}
                    disabled={isDisabled[category]}
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleSetBudget(category)}
                    disabled={isDisabled[category]}
                  >
                    Set
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleResetBudget(category)}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleClearBudget(category)}
                  >
                    Clear
                  </Button>
                </div>

                <div className="mt-3 text-center">
                  <strong>Budget:</strong> ${budget.toFixed(2)} <br />
                  <strong>Spent:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded ${
                      spent > budget ? "bg-danger" : "bg-success"
                    } text-white`}
                  >
                    ${spent.toFixed(2)}
                  </span>{" "}
                  <br />
                  <strong>Remaining:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded ${
                      remaining < 0 ? "bg-danger" : "bg-success"
                    } text-white`}
                  >
                    ${remaining.toFixed(2)}
                  </span>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>

      {/* ✅ Desktop View */}
      <div className="d-none d-md-block">
        <Row className="text-center fw-bold">
          <Col md={3}>Category</Col>
          <Col md={3}>Budget ($)</Col>
          <Col md={2}>Spent</Col>
          <Col md={2}>Remaining</Col>
          <Col md={2}>Actions</Col>
        </Row>

        {categories.map((category) => {
          const budget = categoryBudgets[category] || 0;
          const spent = categorySpending[category] || 0;
          const remaining = budget - spent;

          return (
            <Card className="mb-3 p-2 shadow-sm" key={category}>
              <Row className="align-items-center text-center">
                <Col md={3} className="fw-bold">{category}</Col>
                <Col md={3}>
                  <Form.Control
                    type="number"
                    value={inputValues[category]}
                    onChange={(e) => handleInputChange(category, e.target.value)}
                    disabled={isDisabled[category]}
                  />
                </Col>
                <Col md={2}>
                  <div
                    className={`px-2 py-1 rounded ${
                      spent > budget ? "bg-danger" : "bg-success"
                    } text-white`}
                  >
                    ${spent.toFixed(2)}
                  </div>
                </Col>
                <Col md={2}>
                  <div
                    className={`px-2 py-1 rounded ${
                      remaining < 0 ? "bg-danger" : "bg-success"
                    } text-white`}
                  >
                    ${remaining.toFixed(2)}
                  </div>
                </Col>
                <Col md={2}>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleSetBudget(category)}
                    disabled={isDisabled[category]}
                    className="me-2"
                  >
                    Set
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleResetBudget(category)}
                    className="me-2"
                  >
                    Reset
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleClearBudget(category)}
                  >
                    Clear
                  </Button>
                </Col>
              </Row>
            </Card>
          );
        })}
      </div>
    </Card>
  );
};

export default BudgetOverview;
