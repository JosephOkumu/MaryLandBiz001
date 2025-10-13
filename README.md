# Maryland Business Directory WebApp

## About This Project

The Maryland Business Directory is a full-stack web application designed to help users discover and explore businesses located in Maryland. It features a comprehensive database of businesses, categorized for easy browsing, along with search functionality and a showcase of featured businesses.


## Prerequisites

Before you begin, ensure you have the following installed:
- Python (3.8 or higher)
- Pip (Python package installer)
- Node.js (which includes npm)
- MySQL Server

## Getting Started

Follow these steps to get the application up and running on your local machine.

### 1. Clone and Setup Project

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JosephOkumu/MaryLandBiz001
   cd MaryLandBiz001
   ```

### 2. Backend Setup

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
    -   Create a `.env` file in the `backend` directory by copying `backend/.env.example`:
        ```bash
        cp .env.example .env
        ```
    -   Update the `.env` file with your MySQL credentials:
        ```env
        DB_HOST=localhost
        DB_USER=your_mysql_user
        DB_PASSWORD=your_mysql_password
        DB_NAME=maryland_businesses
        FLASK_SECRET_KEY=your_secret_key_here
        CORS_ORIGINS=http://localhost:5173,http://localhost:8080
        ```
        Replace `your_mysql_user`, `your_mysql_password`, and `your_secret_key_here` with your actual credentials.

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
    python3 app.py
    ```
    The backend API will be running at `http://localhost:5000`.

### 3. Frontend Setup

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

Once both servers are running:

-   **Frontend (User Interface):** Open your web browser and navigate to `http://localhost:5173` (or the URL provided by Vite)
-   **Backend API:** The API endpoints are accessible under `http://localhost:5000/api/...`


## Project Structure

```
MaryLandBiz001/
├── backend/                    # Flask API Backend
│   ├── app.py                 # Main Flask application
│   ├── db_config.py           # Database configuration
│   ├── create_database.py     # Database setup script
│   ├── import_json_to_db.py   # Data import script
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example          # Environment variables template
│   └── parsed_businesses/     # JSON business data files
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utility functions
│   ├── package.json          # Node.js dependencies
│   └── public/               # Static assets
└── README.md                 # This file
```

## Tech Stack

### Backend
- **Framework:** Flask (Python)
- **Database:** MySQL
- **Authentication:** Flask-Login with bcrypt
- **CORS:** Flask-CORS
- **Environment:** python-dotenv

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query
- **Routing:** React Router DOM


## Troubleshooting

### Common Issues

1. **CORS Issues**
   - Ensure `CORS_ORIGINS` in `.env` matches your frontend URL
   - Default: `http://localhost:5173,http://localhost:8080`


## Development

### Running in Development Mode

1. **Backend Development:**
   ```bash
   cd backend
   source venv/bin/activate  # or .\venv\Scripts\activate on Windows
   python3 app.py
   ```

2. **Frontend Development:**
   ```bash
   cd frontend
   npm run dev
   ```

### Building for Production

1. **Frontend Build:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Backend Production:**
   - Set `debug=False` in `app.py`
   - Use a production WSGI server like Gunicorn
   - Configure proper environment variables


## Author

[Joseph Okumu](https://github.com/JosephOkumu)