# Appraisal Management System

A modern, full-stack appraisal management system with Laravel 11+ backend and React frontend. Features role-based access control (Admin, Manager, Employee), annual self-appraisals, KPI ratings, manager review workflow, and PDF export.

![Appraisal Management System](https://img.shields.io/badge/Laravel-12.x-FF2D20?logo=laravel)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss)

## Features

- **Authentication**: Login/Register with Laravel Sanctum
- **Role-Based Access**: Admin, Manager, Employee
- **Employee Dashboard**: Submit self-appraisals, KPI ratings (1-5), achievements, document upload, status tracking
- **Manager Dashboard**: View team appraisals, add ratings & comments, approve/reject
- **Admin Dashboard**: User management, roles, departments, analytics (Total Employees, Pending Reviews)
- **PDF Export**: Download completed appraisals as PDF
- **Modern UI**: Glassmorphism, gradients, Framer Motion animations, dark/light theme toggle
- **Responsive**: Mobile-first design

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Laravel 11+, PHP 8.2, Sanctum, MySQL |
| Frontend | React 19, Vite, Tailwind CSS 4, Framer Motion |
| PDF | DomPDF |
| Deployment | Docker, Kubernetes |

## Quick Start

### Prerequisites

- PHP 8.2+, Composer, Node.js 20+, MySQL 8.0

### Local Development

**1. Backend Setup**

```bash
# Install dependencies
composer install

# Copy environment
cp .env.example .env
php artisan key:generate

# Configure MySQL in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=appraisal_management_system
DB_USERNAME=root
DB_PASSWORD=

# Run migrations & seed
php artisan migrate --seed

# Start server
php artisan serve
```

**2. Frontend Setup**

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

**3. Access**

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api

**Demo Credentials** (password: `password`):
- Admin: admin@example.com
- Manager: manager@example.com
- Employee: employee@example.com

---

## Docker Deployment

```bash
# Build and run
cp .env.docker.example .env
# Set APP_KEY: php artisan key:generate --show
docker-compose up -d

# Run migrations (first time)
docker-compose exec backend php artisan migrate --seed
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

## Kubernetes Deployment

```bash
# Create secrets (copy secrets.yaml.example to secrets.yaml)
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secrets.yaml

# Deploy
kubectl apply -f kubernetes/mysql-deployment.yaml
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/nginx-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/ingress.yaml
```

---

## API Structure

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/register | Register |
| POST | /api/login | Login |
| POST | /api/logout | Logout (auth) |
| GET | /api/user | Current user (auth) |
| GET | /api/appraisals | List appraisals (auth) |
| POST | /api/appraisals | Create appraisal (auth) |
| GET | /api/appraisals/{id} | Get appraisal (auth) |
| PUT | /api/appraisals/{id} | Update appraisal (auth) |
| DELETE | /api/appraisals/{id} | Delete appraisal (auth) |
| POST | /api/appraisals/{id}/submit | Submit for review (auth) |
| GET | /api/appraisals/{id}/export-pdf | Export PDF (auth) |
| POST | /api/appraisals/{id}/upload | Upload document (auth) |
| GET | /api/kpi-templates | List KPI templates (auth) |
| GET | /api/departments | List departments (auth) |
| GET | /api/manager/team-appraisals | Team appraisals (manager/admin) |
| POST | /api/manager/appraisals/{id}/review | Review appraisal (manager/admin) |
| GET | /api/analytics | Analytics (manager/admin) |
| GET/POST | /api/users | Users CRUD (admin) |
| GET/POST | /api/departments | Departments CRUD (admin) |
| GET/POST | /api/kpi-templates | KPI CRUD (admin) |

---

## Environment Variables

### Backend (.env)

| Variable | Description |
|----------|-------------|
| APP_KEY | Laravel encryption key |
| DB_* | MySQL connection |
| SANCTUM_STATEFUL_DOMAINS | Frontend domains (localhost:5173) |
| CORS_ALLOWED_ORIGINS | Allowed CORS origins |

### Frontend (.env)

| Variable | Description |
|----------|-------------|
| VITE_API_URL | API base URL (default: /api) |

---

## Project Structure

```
appraisal_management_system/
├── app/
│   ├── Http/Controllers/Api/   # API controllers
│   ├── Models/                 # Eloquent models
│   └── Http/Middleware/        # Role middleware
├── database/migrations/        # DB migrations
├── database/seeders/           # Seeders
├── routes/api.php             # API routes
├── frontend/                  # React SPA
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # Auth, Theme
│   │   ├── lib/               # API client
│   │   └── pages/             # Page components
│   └── Dockerfile
├── docker-compose.yml
├── Dockerfile                 # Laravel backend
└── kubernetes/                # K8s manifests
```

---

## License

MIT
