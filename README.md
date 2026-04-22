# FREESURF — Freelance Project Bidding Platform

A full-stack web application that connects companies with freelancers through a real-time project bidding system. Companies post projects and review proposals; freelancers browse listings and submit competitive bids.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

---

## Tech Stack

**Frontend**
- HTML5, Vanilla JavaScript (ES6+)
- Tailwind CSS (CDN)
- EmailJS (OTP delivery)
- Google Fonts: Syne, DM Sans

**Backend**
- Node.js
- Express.js v5
- Mongoose v9

**Database**
- MongoDB Atlas (cloud-hosted)

**Authentication**
- bcryptjs (password hashing)
- Email OTP verification via EmailJS

---

## Architecture

The project follows a REST API architecture. The frontend is a single HTML file (`freelance.html`) that communicates with a Node/Express backend over HTTP. The backend connects to MongoDB Atlas via Mongoose.

```
freelance.html  <-->  Express REST API  <-->  MongoDB Atlas
  (Vanilla JS)         (Node.js)               (Mongoose ODM)
```

All API calls are made from the frontend using the native `fetch` API pointing to `http://localhost:5000`.

---

## Project Structure

```
/
├── freelance.html          # Single-file frontend (UI, logic, styles)
├── server.js               # Express app entry point
├── package.json
├── .env                    # Environment variables (not committed)
├── routes/
│   ├── auth.js             # Signup and login endpoints
│   ├── projects.js         # Project CRUD endpoints
│   └── bids.js             # Bid submission and retrieval endpoints
└── models/
    ├── User.js             # User schema
    ├── Project.js          # Project schema
    └── Bid.js              # Bid schema
```

---

## Features

### Landing Page
- Public-facing home page displayed on initial load
- Overview of platform features, stats, and value proposition
- Separate call-to-action flows for freelancers and companies
- Role pre-selection: clicking "Join as Freelancer" or "Post a Project" auto-selects the correct role on the signup form

### Authentication
- User registration with name, email, password, and role selection (freelancer or company)
- Email OTP verification required before account creation completes
- OTP is 6 digits, expires after a 120-second countdown with a resend option
- Password hashing with bcryptjs before storage
- Login with email and password
- Session persisted in `localStorage` under the key `freesurf_user`
- Email confirmation sent on successful account creation via EmailJS

### Freelancer Dashboard
- Personalized greeting using first name
- Stats cards: active bids count, projects won, earnings, rating
- Browse all open projects fetched live from the database (no mock data)
- "My Bids" tab showing all proposals the freelancer has submitted in the current session

### Bidding System
- Freelancers can place a bid on any project they did not post
- Bid modal pre-populates with project title and budget for context
- Required fields: bid amount (positive number) and a written proposal
- Validation prevents bidding on own projects by comparing user ID against project company ID
- Submitted bids are saved to MongoDB via `POST /api/bids`
- Duplicate bidding on the same project is blocked in the current session

### Company Dashboard
- Stats cards: total projects posted, total bids received, projects in progress
- "Post Project" button opens a modal form
- All posted projects are displayed as cards with title, description, budget, deadline, required skills, and status badge

### Project Posting
- Form fields: title, description, budget, deadline, required skills (comma-separated)
- Projects are saved to MongoDB and immediately appear in the freelancer browse feed
- Status defaults to "Open" on creation

### View Bids (Company)
- Each project card has a "View Bids" button
- Opens a modal listing all bids received for that project
- Each bid entry shows freelancer name, email, proposed amount, and full proposal text
- Freelancer name and email are populated server-side from the User collection
- "Accept Bid" button present (UI only, full acceptance flow not yet implemented)

### Profile Page
- Editable fields: full name, email, date of birth, phone, location, bio
- Skills section with add/remove chip interface
- Work preferences: hourly rate, experience level, availability
- Links: GitHub, LinkedIn
- Profile completion progress bar
- Changes saved to `localStorage`

---

## API Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Authenticate and return user object |

**POST /api/auth/signup** — Request body:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword",
  "role": "freelancer"
}
```

**POST /api/auth/login** — Request body:
```json
{
  "email": "jane@example.com",
  "password": "securepassword"
}
```

---

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Fetch all projects |
| POST | `/api/projects` | Create a new project |

**POST /api/projects** — Request body:
```json
{
  "title": "Build a REST API",
  "description": "Need an Express API with MongoDB...",
  "budget": 1500,
  "deadline": "2025-09-01",
  "skills": ["Node.js", "MongoDB"],
  "companyId": "<user_id>"
}
```

---

### Bids

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bids` | Submit a new bid |
| GET | `/api/bids/project/:projectId` | Get all bids for a project (with freelancer info populated) |

**POST /api/bids** — Request body:
```json
{
  "projectId": "<project_id>",
  "freelancerId": "<user_id>",
  "amount": 1200,
  "proposal": "I can deliver this in 3 weeks..."
}
```

**GET /api/bids/project/:projectId** — Response:
```json
[
  {
    "_id": "...",
    "projectId": "...",
    "freelancerId": {
      "_id": "...",
      "name": "Jane Doe",
      "email": "jane@example.com"
    },
    "amount": 1200,
    "proposal": "I can deliver this in 3 weeks...",
    "status": "pending"
  }
]
```

---

## Data Models

### User
```js
{
  name:      String, required
  email:     String, required, unique
  password:  String, required (bcrypt hashed)
  role:      String, enum: ['freelancer', 'company'], required
  createdAt: Date (auto)
}
```

### Project
```js
{
  title:       String, required
  description: String
  budget:      Number
  deadline:    Date
  skills:      [String]
  companyId:   ObjectId, ref: 'User'
  status:      String, enum: ['open', 'in-progress', 'closed'], default: 'open'
  createdAt:   Date (auto)
}
```

### Bid
```js
{
  projectId:    ObjectId, ref: 'Project', required
  freelancerId: ObjectId, ref: 'User', required
  amount:       Number, required
  proposal:     String
  status:       String, enum: ['pending', 'accepted', 'rejected'], default: 'pending'
  createdAt:    Date (auto)
}
```

---

## Getting Started

**Prerequisites**
- Node.js v18 or higher
- A MongoDB Atlas account and cluster
- An EmailJS account with a configured service and templates

**Installation**

1. Clone the repository:
```bash
git clone https://github.com/your-username/freesurf.git
cd freesurf
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (see Environment Variables below).

4. Start the backend server:
```bash
node server.js
```

5. Open `freelance.html` directly in a browser. No build step required.

The server runs on `http://localhost:5000` by default.

---

## Environment Variables

Create a `.env` file in the project root with the following:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/freesurf
PORT=5000
```

The EmailJS credentials (public key, service ID, and template IDs) are configured directly in `freelance.html` at the top of the script block:

```js
const EMAILJS_PUBLIC_KEY       = 'your_public_key';
const EMAILJS_SERVICE_ID       = 'your_service_id';
const EMAILJS_OTP_TEMPLATE     = 'your_otp_template_id';
const EMAILJS_CONFIRM_TEMPLATE = 'your_confirm_template_id';
```

---

## Known Limitations / Planned Features

- Accept Bid flow is UI-only; backend status update not yet wired up
- Profile data is saved to `localStorage` only, not persisted to the database
- No JWT-based authentication; user session relies on `localStorage`
- My Bids tab reflects session state only, not fetched from the database on load
- No pagination on the project listing or bids list
