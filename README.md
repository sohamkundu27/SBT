### 📘 **Smart Budget Tracker (SBT)**

A comprehensive **budget management** web application that helps users **track income and expenses**, **set budgets**, and **visualize spending trends**. Built with **C# .NET Core**, **React**, and **SQL**, this project aligns with the **tech stack used at Xorbix Technologies** and serves as a full-stack development demonstration.

---

## 🚀 **Tech Stack**

### **Backend:**

- **C# .NET Core** – Implements business logic, API endpoints, and server-side processing.
- **ASP.NET Core Web API** – Provides RESTful API functionality to the frontend.
- **Entity Framework Core** – ORM (Object-Relational Mapper) for interacting with SQL databases.
- **MS SQL Server / MySQL** – Stores transaction data, budget settings, and financial records.
- **Azure SQL (optional)** – Cloud-hosted database option for scalability.
- **OpenAI API** – Uses **GPT-4o** for **automatic transaction categorization**.

### **Frontend:**

- **React.js** – Builds an interactive, dynamic user interface.
- **React Hook Form** – Manages form validation and user input.
- **React Router** – Enables seamless navigation within the application.
- **Bootstrap / React-Bootstrap** – Provides a responsive and modern UI design.
- **Chart.js** – Creates **data visualizations** (e.g., bar charts, spending trends).

### **Infrastructure & Tools:**

- **Axios** – Handles HTTP requests between frontend and backend.
- **Docker** – Containerizes the backend for seamless deployment.
- **Git & GitHub** – Version control and collaboration.
- **Postman** – API testing and debugging.
- **VS Code & JetBrains Rider** – IDEs used for development.

---

## 💰 **Core Features**

### **📊 Budget Management**

- Users can **set spending limits** for different categories (e.g., food, rent, entertainment).
- Budgets are saved in a **SQL database** and can be updated dynamically.

### **📉 Track Income & Expenses**

- Users can **log financial transactions** with details like **description, amount, category, and date**.
- Transactions are stored in the database and retrieved in real-time.

### **📈 Data Visualization**

- A **dashboard with interactive graphs** (Chart.js) shows:
  - **Spending trends** across different categories.
  - **Budget progress** (amount spent vs. remaining).
  - **Income vs. Expenses analysis**.
- **Table-based transaction history** allows users to filter and search financial records.

### **⚠️ Real-Time Overspending Alerts**

- The system **notifies users** when spending exceeds the allocated budget.
- Alerts are dynamically generated and displayed in **Bootstrap alerts**.
- Color-coded **budget indicators**:
  - **Green** = Under budget
  - **Yellow** = Near budget
  - **Red** = Over budget

### **🤖 AI-Powered Automatic Categorization**

- Uses **OpenAI's GPT-4o API** to automatically **categorize transactions** based on description.
- Reduces **manual data entry** and ensures **consistent categorization**.

### **🔁 Recurring Expense Tracking**

- Users can **set up recurring expenses** (e.g., rent, Netflix subscriptions).
- The system **auto-generates transactions** at specified intervals.

### **📂 Data Export & Reporting**

- Users can **download financial data** in multiple formats:
  - **CSV** – For use in Excel/Google Sheets.
  - **JSON** – For API integrations and backups.
  - **PDF** – For easy sharing and printing.
- Uses `file-saver` and `jsPDF` for file handling.

---

## 📌 **API Endpoints**

| Method | Endpoint       | Description               |
| ------ | -------------- | ------------------------- |
| `POST` | `/api/add`     | Add a transaction         |
| `POST` | `/api/delete`  | Delete a transaction      |
| `GET`  | `/api/get-all` | Retrieve all transactions |

### **🔹 AI-Powered Categorization**

| Method | Endpoint          | Description                                |
| ------ | ----------------- | ------------------------------------------ |
| `POST` | `/api/categorize` | Uses OpenAI API to categorize transactions |

---

## 🚀 **Planned Enhancements**

- **💳 Bank API Integration** – Auto-fetch transactions from bank accounts.
- **📅 Monthly Reports** – Generate monthly breakdowns of income/expenses.
- **📌 Custom Categories** – Allow users to create and manage their own spending categories.

---

## 🏆 **Why This Project Matters**

This project demonstrates:

- **Full-stack development** using **.NET Core + React + SQL**.
- **REST API design** and best practices.
- **Real-world budget tracking and analytics**.
- **AI-powered automation** with OpenAI integration.
- **Responsive UI/UX** using Bootstrap and Chart.js.

It aligns with industry standards used at **Xorbix Technologies**, making it a **portfolio-ready project** showcasing expertise in **backend, frontend, and databases**.
