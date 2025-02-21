import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";


//Receives the list of transactions, and the last 2 parameters are functions
const TransactionForm = ({ transactions, onAddTransaction, onDeleteTransactions }) => {
  //need these three parameters since its a form
  const { register, handleSubmit, reset } = useForm();
  const [isRecurring, setIsRecurring] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  const onSubmit = async (data) => {
    try {
      //collect data from the form
      const form = new FormData();
      form.append("description", data.description);
      form.append("amount", data.amount);
      //handle recurring case
      if (isRecurring) {
        form.append("frequency", data.frequency || "none");

        const response = await axios.post("http://localhost:5054/api/recurring/add", form);
        //deals with duplicates
        onDeleteTransactions();
        response.data.forEach((transaction) => onAddTransaction(transaction));
      } else {
        const response = await axios.post("http://localhost:5054/api/add", form);
        onAddTransaction(response.data);
      }
      //set everything back to normal
      reset();
      setIsRecurring(false);
      setSuccess("Transaction added successfully!");
      setError(null);

    } catch (error) {
      //? is there so it doesnt throw an error if it's empty
      console.error("Error adding transaction:", error.response?.data || error.message);
      setError("Failed to add transaction. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div className="card p-4">
      <h2 className="mb-3 text-center">Add Transaction</h2>
      {/*if there is an error we will make it red*/}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          {/*we use React Hook Form to track it and provides it as an object, required:true requires the user to input a value before entering*/}
          <Form.Control
            {...register("description", { required: true })}
            placeholder="Description"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="number"
            step="0.01"
            min="0"  // Prevents negative values
            {...register("amount", { 
              required: true, 
              min: { value: 0, message: "Amount must be positive" }  // Validation rule
            })}
            placeholder="Amount (0.00)"
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e") {
                e.preventDefault(); // Stops negative or exponent notation input
              }
            }}
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
            {/*have to register for an input, allows react form hook to track the value and provides it as an object, hard process without*/}
            <Form.Select {...register("frequency")} defaultValue="Monthly">
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
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
