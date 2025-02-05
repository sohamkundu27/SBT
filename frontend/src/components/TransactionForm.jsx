import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

const TransactionForm = ({ transactions, onAddTransaction, onDeleteTransactions }) => {
  const { register, handleSubmit, reset } = useForm();
  const [isRecurring, setIsRecurring] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  const onSubmit = async (data) => {
    try {
      const form = new FormData();
      form.append("description", data.description);
      form.append("amount", data.amount);

      if (isRecurring) {
        form.append("frequency", data.frequency || "none");

        const response = await axios.post("http://localhost:5054/api/recurring/add", form);
        onDeleteTransactions();
        response.data.forEach((transaction) => onAddTransaction(transaction));
      } else {
        const response = await axios.post("http://localhost:5054/api/add", form);
        onAddTransaction(response.data);
      }

      reset();
      setIsRecurring(false);
      setSuccess("✅ Transaction added successfully!");
      setError(null);


    } catch (error) {
      console.error("❌ Error adding transaction:", error.response?.data || error.message);
      setError("❌ Failed to add transaction. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div className="card p-4">
      <h2 className="mb-3 text-center">Add Transaction</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Control
            {...register("description", { required: true })}
            placeholder="Description"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="number"
            step="0.01"
            {...register("amount", { required: true })}
            placeholder="Amount (0.00)"
          />
        </Form.Group>

        <Form.Check
          type="checkbox"
          label="Is this a recurring expense?"
          checked={isRecurring}
          onChange={() => setIsRecurring(!isRecurring)}
          className="mb-2"
        />

        {isRecurring && (
          <Form.Group className="mb-3">
            <Form.Label>Frequency</Form.Label>
            <Form.Select {...register("frequency")} defaultValue="monthly">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </Form.Select>
          </Form.Group>
        )}

        <Button type="submit" variant="primary" className="w-100">
          Add Transaction
        </Button>
      </Form>
    </div>
  );
};

export default TransactionForm;
