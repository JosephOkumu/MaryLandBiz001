---
description: Deploy Backend to DigitalOcean Droplet (Project Specific)
---

This workflow documents the exact steps taken to deploy the **MaryLandBiz** backend to a DigitalOcean Droplet and connect it with the Vercel-hosted frontend.

## 1. Server Access & Prerequisites
- **Droplet IP**: `64.225.29.143`
- **User**: `root`
- **Domain**: `api.pcgbusinessdirectory.com` (Backend), `www.pcgbusinessdirectory.com` (Frontend)

SSH into the server:
```bash
ssh root@64.225.29.143
```

## 2. System Dependencies
Installed packages:
```bash
apt update
apt install python3-pip python3-venv mysql-server nginx git libmysqlclient-dev pkg-config python3-dev build-essential -y
```

## 3. Database Setup (MySQL)
1.  **Secure Installation**: `mysql_secure_installation`
2.  **Create Database & User**:
    ```sql
    CREATE DATABASE maryland_businesses;
    CREATE USER 'maryland_user'@'localhost' IDENTIFIED BY 'MarylandSafe2024!';
    GRANT ALL PRIVILEGES ON maryland_businesses.* TO 'maryland_user'@'localhost';
    FLUSH PRIVILEGES;
    ```

## 4. Backend Deployment
1.  **Clone Repo**:
    ```bash
    cd /var/www
    git clone https://github.com/JosephOkumu/MaryLandBiz001.git
    cd MaryLandBiz001/backend
    ```

2.  **Virtual Environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

3.  **Environment Variables (`.env`)**:
    ```ini
    FLASK_SECRET_KEY=...
    DB_HOST=localhost
    DB_USER=maryland_user
    DB_PASSWORD=MarylandSafe2024!
    DB_NAME=maryland_businesses
    # CRITICAL: Must include production frontend domain
    CORS_ORIGINS=http://localhost:5173,https://pcgbusinessdirectory.com,https://www.pcgbusinessdirectory.com
    ```

## 5. Gunicorn & Systemd
Service file: `/etc/systemd/system/marylandbiz.service`
```ini
[Unit]
Description=Gunicorn instance to serve MaryLandBiz Backend
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/MaryLandBiz001/backend
Environment="PATH=/var/www/MaryLandBiz001/backend/venv/bin"
ExecStart=/var/www/MaryLandBiz001/backend/venv/bin/gunicorn --workers 3 --bind unix:marylandbiz.sock -m 007 app:app

[Install]
WantedBy=multi-user.target
```
Commands:
```bash
systemctl start marylandbiz
systemctl enable marylandbiz
```

## 6. Nginx Reverse Proxy
Config file: `/etc/nginx/sites-available/marylandbiz`
```nginx
server {
    listen 80;
    server_name api.pcgbusinessdirectory.com;

    location / {
        include proxy_params;
        proxy_pass http://unix:/var/www/MaryLandBiz001/backend/marylandbiz.sock;
    }

    location /uploads {
        alias /var/www/MaryLandBiz001/backend/uploads;
    }
}
```
Link and Restart:
```bash
ln -s /etc/nginx/sites-available/marylandbiz /etc/nginx/sites-enabled
systemctl restart nginx
```

## 7. SSL Configuration (Certbot)
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d api.pcgbusinessdirectory.com
```

## 8. Data Migration (Local -> Production)
To push local development data to the production server:

1.  **Export Local Data** (Run on local machine):
    ```bash
    mysqldump -u maryland_user -p maryland_businesses categories businesses > local_data_dump.sql
    ```
2.  **Transfer to Server** (Run on local machine):
    ```bash
    scp local_data_dump.sql root@64.225.29.143:/root/
    ```
3.  **Fix Collation & Import** (Run on Server):
    *MySQL 8.0+ (local) often uses `utf8mb4_uca1400_ai_ci` which older MySQL versions don't support.*
    ```bash
    # Replace incompatible collation
    sed -i 's/utf8mb4_uca1400_ai_ci/utf8mb4_unicode_ci/g' /root/local_data_dump.sql
    
    # Import
    mysql -u maryland_user -p maryland_businesses < /root/local_data_dump.sql
    ```

## 9. Frontend Configuration (Vercel)
1.  **Dynamic API URL**:
    Updated `src/lib/api.ts` to automatically switch between localhost and production:
    ```typescript
    export const API_BASE_URL = 
      window.location.hostname === 'localhost' 
        ? "http://localhost:5000" 
        : "https://api.pcgbusinessdirectory.com";
    ```
2.  **SPA Routing**:
    Added `vercel.json` to root of frontend to handle client-side routing (fixing 404s on refresh):
    ```json
    {
      "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
    }
    ```
