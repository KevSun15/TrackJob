# TrackJob

**TrackJob: The Modern MERN Job Board Platform**

TrackJob is a full-stack, **MERN-based job board application** designed to efficiently connect job applicants with recruiters.  
It features separate, specialized interfaces for both user types — streamlining the entire hiring process from **job posting** to **application management** and **final decision-making**.

---

## 🌟 Key Features

### 👨‍💼 For Applicants
-  **Advanced Job Search:** Search thousands of listings by job title, keyword, company, and location (including remote options).  
-  **Company Exploration:** Browse and research companies offering jobs.  
-  **Profile Management:** Create and update a professional profile, including skills and resume.  
-  **Application Tracking:** Apply for jobs and monitor the status of all submitted applications in a centralized dashboard.  

### 🧑‍💼 For Recruiters
-  **Job Management:** Create, edit, and manage job listings with detailed requirements.  
-  **Application Review:** View all applicants for their posted jobs.  
-  **Status Workflow:** Change the status of applications (e.g., Pending, Interview, Reject, Hire).  
-  **Hiring Decisions:** Efficiently manage the hiring funnel from start to finish.  

---

## 🛠️ Tech Stack

TrackJob utilizes a **modern MERN stack** architecture with a strong emphasis on **performance** and **maintainability** through **TypeScript** and **Redux Toolkit**.

### 🖥️ Frontend (Client)
- **Language:** TypeScript  
- **Framework:** React  
- **State Management:** Redux Toolkit (React-Redux)  
- **Styling:** Tailwind CSS  
- **Bundler:** Vite  
- **Routing & Icons:** react-router-dom, @heroicons  

### ⚙️ Backend (Server)
- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** MongoDB  
- **ODM:** Mongoose  
- **Security:** JSON Web Tokens (JWT)  
- **Storage:** Cloudinary  

---

## 🔑 Authentication (JWT Strategy)

Authentication is secured using **JSON Web Tokens (JWT)**, ensuring controlled access for both applicants and recruiters.

1. **Login:** Server authenticates credentials against MongoDB.  
2. **Token Generation:** A JWT is created containing the user’s ID and role, signed using the `JWT_SECRET`.  
3. **Access:** The client stores this token securely (e.g., in an HTTP-only cookie).  
4. **Authorization:** For protected routes, the backend verifies the token and extracts the user’s role to allow or deny access.

---

## 🧩 Getting Started

Follow these steps to set up and run **TrackJob** locally.  
The project is split into two directories: **frontend** and **backend**.

---

### 1. Prerequisites

Make sure you have the following installed:
- [Node.js (LTS)](https://nodejs.org/)
- npm, yarn, or pnpm
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/TrackJob.git
cd TrackJob
```


---

### 3. Environment Setup

Create a `.env` file in the backend folder and fill in the following fields:

```bash
MONGO_URI = ""
PORT=5001 = ""
NODE_ENV= ""
JWT_SECRET = ""
CLOUDINARY_SECRET = ""
CLOUDINARY_API_KEY = ""
CLOUD_NAME = ""
```

### 4 Install Dependencies

Install dependencies for both the **backend** and **frontend**:

```bash
cd backend
npm install
```

```bash
cd ../frontend
npm install
```

---

#### ▶️ Run Both (Recommended for Development)

You can start both the **client** and **server** simultaneously or independently.
From the project root (`/TrackJob`):

Frontend: 

```bash
cd frontend
npm run dev
```

Backend:
```bash
cd backend
npm run server
```

Or run both from the root (`/TrackJob`):

```bash
npm run dev
```

### Open in:
- **Client (Frontend):** http://localhost:5173  
- **Server (Backend):** http://localhost:5001 

---
## 🧪 Project Structure

TrackJob/
├── backend/ # Express + MongoDB API
│ ├── models/ 
│ ├── routes/ 
│ ├── config/ 
│ ├── controllers/ 
│ ├── middleware/ 
│ ├── server.js 
│ └── package.json
│ └── .env
│
├── frontend/ # React + Vite client
│ ├── src/
│ │ ├── components/
│ │ ├── redux/
│ │ ├── App.tsx
│ │ └── main.tsx
│ │ └── index.css
│ └── package.json
│
├── package.json
├── index.html
└── README.md








