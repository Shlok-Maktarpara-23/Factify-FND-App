# 📰 Factify - Fake News Detection App

A full-stack web application that helps users identify and verify fake news using AI/ML models, real-time news feeds, quizzes, and community feedback — built with **Django REST Framework** (Backend) and **React + Vite** (Frontend).

---

## 🚀 Features

- 🔐 **User Authentication** — Register, Login, Logout with JWT-based authentication
- 🏠 **Home Dashboard** — Personalized news feed for authenticated users
- 📰 **Category-wise News** — Browse news filtered by category
- 🔍 **Check News by Title** — Verify whether a news article is real or fake by entering its title
- 🧠 **News Quiz** — Test your fake news detection skills with interactive quizzes
- 📊 **Feedback Dashboard** — View and submit community feedback on news articles
- 📡 **Live News Feed** — Real-time news updates integrated via API
- 🛡️ **Protected Routes** — All main features locked behind authentication

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Python 3 | Core language |
| Django 5.2 | Web framework |
| Django REST Framework | REST API development |
| SimpleJWT | JWT Authentication |
| CORS Headers | Cross-origin resource sharing |
| SQLite | Database |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI Library |
| Vite | Build tool & dev server |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Hook Form + Zod | Form handling & validation |
| React Toastify | Notifications |

---

## 📁 Project Structure

```
Factify - FND App/
│
├── Backend - DRF/          # Django REST Framework backend
│   ├── API/                # API routing & configuration
│   ├── Core/               # Django project settings
│   ├── User/               # Custom user model & auth views
│   ├── News/               # News management app
│   ├── Livenews/           # Live news feed app
│   ├── UserCheckByTitle/   # Fake news detection by title
│   ├── NewsQuiz/           # Quiz feature app
│   ├── models/             # Shared models
│   ├── game_data/          # Quiz/game data
│   └── manage.py
│
└── Frontend - REACT/       # React + Vite frontend
    ├── src/
    │   ├── pages/          # All page components
    │   ├── components/     # Reusable UI components
    │   ├── context/        # Auth context (AuthProvider)
    │   ├── routes/         # Protected route logic
    │   ├── axios Instance/ # Axios configuration
    │   └── App.jsx         # Main app with routing
    ├── public/
    └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- pip
- npm

---

### 🔧 Backend Setup

```bash
# 1. Navigate to the backend directory
cd "Backend - DRF"

# 2. Create and activate virtual environment
python -m venv myenv

# Windows
myenv\Scripts\activate

# Mac/Linux
source myenv/bin/activate

# 3. Install dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

# 4. Run migrations
python manage.py makemigrations
python manage.py migrate

# 5. Create superuser (for admin access)
python manage.py createsuperuser

# 6. Start the development server
python manage.py runserver
```

Backend will be running at: `http://127.0.0.1:8000`

---

### 💻 Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd "Frontend - REACT"

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Frontend will be running at: `http://localhost:5173`

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register/` | User registration |
| POST | `/api/login/` | User login |
| POST | `/api/logout/` | User logout |
| GET | `/api/info/` | Get logged-in user info |
| POST | `/api/token/` | Obtain JWT token pair |
| POST | `/api/token/refresh/` | Refresh JWT access token |

---

## 🌐 Frontend Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/register` | Public | Registration page |
| `/login` | Public | Login page |
| `/home` | 🔒 Protected | Home dashboard |
| `/category/:category` | 🔒 Protected | Category news feed |
| `/checkbytitle` | 🔒 Protected | Verify news by title |
| `/newsquiz` | 🔒 Protected | News quiz game |
| `/feedback` | 🔒 Protected | Feedback dashboard |

---

## 🔐 Environment Variables

> ⚠️ Before pushing to production, move sensitive values to a `.env` file.

In `Backend - DRF/Core/settings.py`, update:

```python
SECRET_KEY = 'your-secure-secret-key-here'
DEBUG = False  # Set to False in production
ALLOWED_HOSTS = ['yourdomain.com']
```

---

## 👤 Admin Panel

Access Django's admin panel at:
```
http://127.0.0.1:8000/admin/
```
Login with the superuser credentials you created.

---

## 📄 License

This project is for educational purposes.
