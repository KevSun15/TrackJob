# TrackJob

TrackJob: The Modern MERN Job Board Platform

TrackJob is a full-stack, MERN-based job board application designed to efficiently connect job applicants with recruiters. It features separate, specialized interfaces for both user types, streamlining the entire hiring process from job posting to application management and final decision-making.

🌟 Key Features

For Applicants

Advanced Job Search: Search thousands of listings by job title, keyword, company, and location (including remote options).

Company Exploration: Browse and research companies offering jobs.

Profile Management: Create and update a professional profile, including skills and resume.

Application Tracking: Apply for jobs and monitor the status of all submitted applications in a centralized dashboard.

For Recruiters

Job Management: Create, edit, and manage job listings with detailed requirements.

Application Review: View all applicants for their posted jobs.

Status Workflow: Change the status of applications (e.g., Pending, Interview, Reject, Hire).

Hiring Decisions: Efficiently manage the hiring funnel from start to finish.

🛠️ Tech Stack

TrackJob utilizes a modern MERN stack architecture with a strong emphasis on performance and maintainability through the use of TypeScript and Redux Toolkit.

Frontend Tech Stack (Client)

Language: TypeScript

Framework: React

State Management: React-Redux (Redux Toolkit)

Styling: Tailwind CSS

Bundler: Vite

Other: react-router-dom, @heroicons

Backend Tech Stack (Server)

Runtime: Node.js

Framework: Express.js

Database: MongoDB

ODM: Mongoose

Security: JSON Web Tokens (JWT)

Storage: Cloudinary

🔑 Authentication (JWT Strategy)

Authentication is secured using JSON Web Tokens (JWT), ensuring controlled access for applicants and recruiters.

Login: Server authenticates credentials against MongoDB.

Token Generation: A JWT is created, containing the user's ID and role, and signed using the JWT_SECRET.

Access: The client stores this token (e.g., in an HTTP-only cookie).

Authorization: For protected routes, the client sends the token. Backend middleware verifies the token and extracts the user's role, ensuring only authorized actions are performed.

🚀 Getting Started

Follow these instructions to set up and run the project locally. The project is split into two directories: frontend and backend.

1. Prerequisites

Make sure you have the following installed:

Node.js (LTS version recommended)

npm (or yarn/pnpm)

MongoDB instance (local or Atlas)

2. Clone the Repository

Clone the project repository to your local machine:

git clone [https://github.com/your-username/TrackJob.git](https://github.com/your-username/TrackJob.git)
cd TrackJob


3. Environment Setup

Create a file named .env in the root directory of the project (/TrackJob). You must fill in the values for each field:

MONGO_URI=
PORT=5001
NODE_ENV=
JWT_SECRET=
CLOUDINARY_SECRET=
CLOUDINARY_API_KEY=
CLOUD_NAME=


4. Install Dependencies

You must install dependencies for both the frontend and backend folders:

# Navigate to the backend folder and install dependencies
cd backend
npm install

# Navigate to the frontend folder and install dependencies
cd ../frontend
npm install


5. Running the Application

You can start both the client and server simultaneously from the root directory, or run them independently.

Run Both (Recommended for Development)

Navigate to the project root (/TrackJob) and run the combined dev script:

# From /TrackJob
npm run dev


Client (Frontend): http://localhost:5173

Server (Backend): http://localhost:5001

Run Client or Server Independently

To run only the frontend client (Vite):

# From /TrackJob/frontend
npm run dev


To run only the backend server (Node/Express):

# From /TrackJob/backend
npm run server
