# Maryland Business Directory

## About This Project

The Maryland Business Directory is a web application designed to help users discover and explore businesses located in Maryland. It features a comprehensive database of businesses, categorized for easy browsing, along with search functionality and a showcase of featured businesses.

The application consists of:
- A **Python Flask backend** that serves business data from a MySQL database via a REST API.
- A **React (Vite + TypeScript) frontend** that provides a user-friendly interface to interact with the business directory.

## Prerequisites

Before you begin, ensure you have the following installed:
- Python (3.8 or higher)
- Pip (Python package installer)
- Node.js (which includes npm)
- MySQL Server

## Getting Started

Follow these steps to get the application up and running on your local machine.

### 1. Backend Setup

The backend is responsible for managing and serving the business data.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a Python virtual environment:**
    (Recommended to keep dependencies isolated)
    ```bash
    python -m venv venv
    ```
    Activate the virtual environment:
    - On macOS and Linux:
      ```bash
      source venv/bin/activate
      ```
    - On Windows:
      ```bash
      .\venv\Scripts\activate
      ```

3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure MySQL Connection:**
    -   Ensure your MySQL server is running.
    -   Create a `.env` file in the `backend` directory by copying or renaming `backend/.env.example` (if it exists) or creating it from scratch.
    -   Update the `.env` file with your MySQL credentials:
        ```env
        DB_HOST=localhost
        DB_USER=your_mysql_user
        DB_PASSWORD=your_mysql_password
        DB_NAME=maryland_businesses
        ```
        Replace `your_mysql_user` and `your_mysql_password` with your actual MySQL credentials. The `DB_NAME` is typically `maryland_businesses`.

5.  **Set up the database:**
    These scripts create the database schema and populate it with initial data.
    ```bash
    python create_database.py
    python import_json_to_db.py
    ```
    Optionally, to set some businesses as featured:
    ```bash
    python set_featured_businesses.py
    ```

6.  **Start the Backend API Server:**
    ```bash
    python app.py
    ```
    The backend API will be running at `http://localhost:5000`.

### 2. Frontend Setup

The frontend provides the user interface for the business directory.

1.  **Navigate to the frontend directory:**
    (From the project root)
    ```bash
    cd frontend
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```
    (Or `yarn install` or `pnpm install` if you use a different package manager)

3.  **Start the Frontend Development Server:**
    ```bash
    npm run dev
    ```
    (Or `yarn dev` or `pnpm dev`)

    The frontend application will typically be available at `http://localhost:5173` (Vite's default port). Check your terminal output for the exact URL.

## Accessing the Application

-   **Frontend (User Interface):** Open your web browser and navigate to `http://localhost:8080` (or the URL provided by Vite).
-   **Backend API:** The API endpoints are accessible under `http://localhost:5000/api/...`.

## Project Structure

-   `/backend`: Contains the Python Flask API, database scripts, and backend-specific configurations.
-   `/frontend`: Contains the React (Vite + TypeScript) application, components, pages, and frontend-specific configurations.
-   `/parsed_businesses`: Contains the JSON business data files used to populate the database (referenced by `backend/import_json_to_db.py`).

## Aurthor

[Joseph OKumu](https://github.com/JosephOkumu)