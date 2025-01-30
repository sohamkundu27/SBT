import React, { useState, useEffect } from "react";
import { Table, Spinner } from "react-bootstrap";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const TransactionList = ({ transactions }) => {
  const [categorizedTransactions, setCategorizedTransactions] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const updatedTransactions = await Promise.all(
        transactions.map(async (txn) => {
          if (!txn.category) {
            try {
              const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                  model: "gpt-4-turbo",
                  messages: [
                    {
                      role: "system",
                      content: "You are a financial assistant that categorizes transactions into one of the following categories: Groceries, Dining, Entertainment, Rent, Utilities, Other.",
                    },
                    {
                      role: "user",
                      content: `Categorize this transaction: "${txn.description}".`,
                    },
                  ],
                  max_tokens: 10,
                }),
              });

              const data = await response.json();
              const category = data.choices?.[0]?.message?.content?.trim() || "Unknown";

              return { ...txn, category };
            } catch (error) {
              console.error("Error categorizing transaction:", error);
              return { ...txn, category: "Unknown" };
            }
          }
          return txn;
        })
      );
      setCategorizedTransactions(updatedTransactions);
    };

    if (transactions.length > 0) {
      fetchCategories();
    }
  }, [transactions]);

  return (
    <div className="card p-4 mt-3">
      <h2 className="mb-3">Transaction History</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount ($)</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {categorizedTransactions.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">
                <Spinner animation="border" size="sm" /> Categorizing transactions...
              </td>
            </tr>
          ) : (
            categorizedTransactions.map((txn, index) => (
              <tr key={index}>
                <td>{txn.description}</td>
                <td className={txn.amount < 0 ? "text-danger" : "text-success"}>
                  ${txn.amount}
                </td>
                <td>{txn.category}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TransactionList;
