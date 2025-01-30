import React from "react";
import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";

const TransactionForm = ({ onAddTransaction }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    onAddTransaction(data);
    reset(); // Clear form after submission
  };

  return (
    <div className="card p-4">
      <h2 className="mb-3">Add Transaction</h2>
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
            {...register("amount", { required: true })}
            placeholder="Amount ($)"
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100">
          Add Transaction
        </Button>
      </Form>
    </div>
  );
};

export default TransactionForm;