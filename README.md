<p align="center">
<img width="300" height="167" alt="TrackJob-Logo" src="https://github.com/user-attachments/assets/8d24bb3e-e35a-4e59-9fc5-5c10c5975169" />
</p>

# TrackJob  


### TrackJob: A Modern MERN Job Board

TrackJob is a full-stack MERN job board built from the ground up to streamline the hiring process for everyone involved. 
It provides two distinct, specialized interfaces—one for job seekers and one for recruiters—to ensure a seamless and efficient experience from job posting to final hire. 

---

## Key Features

### For Job Seekers
-  **Discover Your Perfect Role:** Use our advanced search to find thousands of listings by title, keyword, company, or location.
-  **Research & Connect with Companies:** Browse detailed company profiles to learn about their culture and available opportunities.
-  **Build Your Professional Profile:** Create and maintain a compelling profile to showcase your skills and experience to recruiters.  
-  **Track Your Applications with Confidence:** Monitor the status of all your submitted applications (e.g., "Viewed," "In Progress") from a single, centralized dashboard.

### For Recruiters & Hiring Managers
-  **Attract the Right Talent:** Easily create, edit, and manage detailed job listings for each of your companies to reach qualified candidates.
-  **Review Candidates in One Place:** View and organize all applicants for your posted jobs in a simple, intuitive interface.
-  **Streamline Your Hiring Pipeline:** Efficiently manage your candidates by updating their application status (e.g., "Pending", "Rejected", "Hired").  
-  **A Dashboard for Decision-Making:** Manage your entire hiring funnel from one powerful dashboard, from initial posting to final decision.

---

## Tech Stack

TrackJob is built on a powerful and modern MERN stack, with a strong emphasis on performance, scalability, and maintainability. The frontend and UI/UX uses Typescript with React framework while the backend uses Javascript/Node.js with Express.js Framework. MongoDB is used as the database with tailwindcss for styling. The REST API in the backend is called through RTK query in the frontend. 

### Frontend (Client)
- **Language:** TypeScript  
- **Framework:** React  
- **State Management:** Redux Toolkit (React-Redux)  
- **Styling:** Tailwind CSS, shadcn/ui, Radix, lucid-icons  
- **Routing and Tooling:** Vite, React Router, RTK query

### Backend (Server)
- **Runtime:** Node.js, Javascript  
- **Framework:** Express.js  
- **Database:** MongoDB with Mongoose (ODM)
- **Security & Auth:** JSON Web Tokens (JWT)  
- **Assests** Cloudinary (Avatar and Resumes)

---

## Secure, Role-Based Authentication

Authentication is secured using JSON Web Tokens (JWT) to ensure that all user data is protected and access is role-appropriate. The system clearly distinguishes between Job Seekers and Recruiters, providing a secure and specialized experience for each.

**Authentication Flow**

1. **Login & Verification:** During registration the password is encrypted and stored in MongoDB as the server generates a JWT token based on the user's id and role. User Credentials is validated against MongoDB during login.
2. **Token Generation:** Upon success, the server generates a secure, signed JWT containing the user's ID and their specific role (e.g., 'applicant' or 'recruiter').  
3. **Secure Storage:** This token is sent to the client and stored securely in an HTTP-only cookie.  
4. **Authorization:** For every subsequent request on a protected route, the client automatically sends the token. Backend middleware verifies the token's signature and checks the user's role, granting or-denying access as appropriate.

---

## Getting Started

Follow these steps to set up and run **TrackJob** locally.  
The project is split into two directories: **frontend** and **backend**.

### 1. Clone the Repository

```bash
git clone https://github.com/KevSun15/TrackJob.git
cd TrackJob
```

---

### 2. Environment Setup

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

### 3. Install Dependencies

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

#### 4. Running TrackJob locally

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
## Project Structure

``` bash
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
```








