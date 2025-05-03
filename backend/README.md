# Maryland Business Directory Backend

This backend system imports business data from JSON files into a MySQL database and provides API endpoints for the frontend to access the data.

## Setup Instructions

### 1. Prerequisites

- Python 3.8 or higher
- MySQL Server installed and running
- pip (Python package installer)

### 2. Environment Setup

1. Update the `.env` file with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=maryland_businesses
   ```

2. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

### 3. Database Setup

1. Run the database creation script:
   ```
   python create_database.py
   ```

2. Import the JSON data into the database:
   ```
   python import_json_to_db.py
   ```

3. Set some businesses as featured:
   ```
   python set_featured_businesses.py
   ```

### 4. Running the API Server

Start the Flask API server:
```
python app.py
```

The API will be available at http://localhost:5000

## API Endpoints

- `GET /api/businesses` - Get all businesses (with optional category filter and pagination)
- `GET /api/businesses/featured` - Get featured businesses for the homepage
- `GET /api/categories` - Get all business categories
- `GET /api/businesses/search` - Search businesses by name, description, or category
- `POST /api/businesses/set-featured` - Set a business as featured

## Notes

- The JSON data is sourced from the `parsed_businesses` directory
- Featured businesses are randomly selected by default, but can be manually set
- The API includes CORS support for local frontend development
