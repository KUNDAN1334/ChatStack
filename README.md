<h1 align="center">💬 ChatStack</h1>

<p align="center">
  <b>Full-Stack AI-Powered Chatbot Platform</b><br/>
  <i>Built with FastAPI ⚡ React ⚛️ MongoDB 🍃 Railway 🚄 Vercel 🌐</i>
</p>

---

# 💬 ChatStack

A full-stack **AI chatbot system** with an embeddable widget, interactive dashboard, and analytics backend — powered by **FastAPI**, **React**, and **MongoDB**.

Dashboard--> https://chat-stack-55ye.vercel.app/
---

## 🧠 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Future Enhancements](#future-enhancements)


---

## 🏗️ About the Project

ChatStack is a production-ready **AI assistant platform** built to help teams and developers deploy custom chatbots within minutes.  
It includes:

1. **Chat Widget** for integrating assistants into client websites.  
2. **Dashboard** for managing leads, API keys, and analytics.  
3. **FastAPI Backend** for real-time chat responses powered by AI APIs.

> Fully containerized, API-driven, and deployed via **Vercel + Railway**.

---

## 🌟 Features

### 🔹 Chat Widget
- Embed directly into any website via a small `<script>` tag.  
- Interactive interface with smooth animations.  
- Customizable themes (color, position, welcome text).  
- Supports emoji, markdown, and multi-turn context.  
- Uses session-based persistence and API-key authentication.  
- Connects to AI backend via REST (Axios + FastAPI).  

### 🔹 Admin Dashboard
- Manage Clients and their API Keys.  
- View Leads captured via chatbot forms.  
- Analytics including total sessions, messages, and active users.  
- Integration-ready structure (support for pagination, sorting).  
- Role-based access (Admin vs Client).  

### 🔹 Backend Features
- Built with **FastAPI** and **Uvicorn** for async performance.  
- Integrates **Groq/OpenAI API** for AI completions.  
- MongoDB for storing leads, users, and sessions.  
- API-driven architecture for scalable integration.  
- Detailed logging and structured error handling.  

---

## ⚙️ Tech Stack

| Layer | Technology |
|--------|------------|
| **Frontend (Widget & Dashboard)** | React + Vite |
| **Backend** | FastAPI (Python) + Uvicorn |
| **Database** | MongoDB (Motor client) |
| **AI Integration** | Groq (OpenAI-compatible API) |
| **Hosting** | Railway (Backend), Vercel (Frontend) |
| **Version Control** | Git + GitHub |
| **Languages** | TypeScript, JavaScript (Frontend), Python (Backend) |

---

## 🧩 Architecture

ChatStack/
├── backend/ # API logic
│ ├── app/
│ │ ├── main.py # Server entry
│ │ ├── database.py # MongoDB integration
│ │ └── routes/ # Endpoints (chat, analytics, leads, clients)
│ └── requirements.txt
│
├── frontend/
│ ├── widget/ # Embeddable Chat Widget
│ │ ├── components/
│ │ ├── services/api.js
│ │ └── index.jsx
│ │
│ ├── dashboard/ # Admin UI
│ │ ├── pages/
│ │ └── services/api.js
│
└── README.md

---

## 🔧 Installation

### 1. Clone Repository
git clone https://github.com/KUNDAN1334/ChatStack.git
cd ChatStack

### 2. Install Dependencies

**Backend**
cd backend
pip install -r requirements.txt

text
**Frontend (Widget or Dashboard)**
cd frontend/widget # or frontend/dashboard
npm install


---

## 🧠 Running Locally

**Backend**
cd backend
uvicorn app.main:app --reload

View API docs at:  
👉 [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

**Frontend**
npm run dev
Widget typically runs on `http://localhost:5173`  
Dashboard runs on `http://localhost:5174`

---

## 🔐 Environment Variables

### Frontend
VITE_API_URL=https://chatstack-production-xxxx.up.railway.app
### Backend
PORT=8080
MONGO_URI=<Your MongoDB Connection String>
GROQ_API_KEY=<Your Groq/OpenAI API Key>


---

## ☁️ Deployment

### Backend on Railway
1. Connect GitHub → Railway.
2. Set environment variables (`MONGO_URI`, `GROQ_API_KEY`).
3. Deploy as a **Web Service**.
4. Railway auto-assigns domain →  
   `https://chatstack-production-xxxx.up.railway.app`.

### Frontend on Vercel
1. Go to Vercel → New Project → Import Repo.
2. Set:
VITE_API_URL=https://chatstack-production-xxxx.up.railway.app3. Deploy widget and dashboard separately.

---

## 🔗 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Handles AI message requests |
| `/api/leads` | POST | Stores leads from widget interactions |
| `/api/clients` | GET/POST/DELETE | Client and API key management |
| `/api/analytics` | GET | Summary metrics for dashboard |

---

## 🧠 Core Features in Depth

- **Dynamic Session Context** – Each chat flow maintains persistent session data.  
- **AI-Driven Chat** – All communication goes through Groq API for intelligent responses.  
- **CORS-Enabled Integration** – Secure, multi-origin frontend support.  
- **Client APIs with Authentication** – Each widget instance uses distinct API key.  
- **Logging Middleware** – Tracks message activity logs and request timing.  
- **FastAPI Auto Docs** – Interactive OpenAPI documentation.  

---

## 🪄 Troubleshooting

| Issue | Cause | Fix |
|-------|--------|-----|
| `net::ERR_NAME_NOT_RESOLVED` | Railway app not public | Redeploy as a Web Service |
| CORS blocked | Domain mismatch | Add Vercel frontend domain in backend CORS list |
| 404 on `/api/chat` | Wrong API URL | Check `VITE_API_URL` variable |
| Widget shows no response | Invalid API key | Regenerate keys in dashboard |

---

## 🚀 Future Enhancements

- Multi-agent chat workflows  
- Custom AI model selection per client  
- Dashboard graphs for daily usage trends  
- Email lead capture notifications  
- UI for API key regeneration  
- Dockerized service templates  

---

## 👨‍💻 Author

**Developed by:** [Kundan (KUNDAN1334)](https://github.com/KUNDAN1334)

**Highlights**
- Fullstack architecture designed from scratch.
- CI/CD via Railway + Vercel GitHub hooks.
- Dynamic chat flow architecture for AI messaging.
- Pixel-perfect React interface for widget and dashboard.

---

## 📄 License
This project is licensed under the **MIT License**.


<p align="center">
<img src="https://skillicons.dev/icons?i=react,fastapi,python,mongodb,vercel,railway" alt="Tech Stack Icons">
<br>
<sub>ChatStack – Smart Conversations, Simplified.</sub>
</p>

