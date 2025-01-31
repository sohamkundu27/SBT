import React from "react";
import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import axios from 'axios'
import TransactionList from "./TransactionList";

const categories = ["Groceries", "Dining", "Entertainment", "Rent", "Utilities", "Other"];

const TransactionForm = ({ transactions, onAddTransaction, onDeleteTransactions }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    const form = new FormData();
    form.append("description", data.description);
    form.append("amount", data.amount);
    const response = await axios.post("https://localhost:7224/api/add", form);
    if (transactions === response.data){
      onAddTransaction(data);
    }
    else{
      onDeleteTransactions();
      for (let i = 0; i < response.data.length; i++){
        console.log(response.data[i]);
        onAddTransaction(response.data[i]);
      }
    }
    reset();
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
            type="number" step="0.01"
            {...register("amount", { required: true })}
            placeholder="Amount (0.00)"
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