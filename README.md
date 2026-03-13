⚡ Pikachu AI – Smart Academic Resource Discovery Platform

An AI-powered platform that helps students quickly discover reliable academic resources like notes, PPTs, previous year papers, textbooks, and explanations aligned with their courses.

🌐 Live Demo:
👉 https://pikachu-ai-production.up.railway.app

📚 Problem Statement

During exams, students struggle to find:

Notes

PPTs

Previous Year Questions

Textbooks

Quick concept explanations

These resources are scattered across WhatsApp groups, Google Drive, LMS portals, and personal folders.

Solution: Pikachu AI centralizes everything and uses AI to help students discover resources instantly.

🚀 Features
🔍 Smart Resource Search

Search by subject

Search by topic

Search by keywords

AI assisted discovery

🤖 AI Assistant (Gemini Powered)

Ask academic questions

Get explanations

Resource recommendations

Topic guidance

📂 Resource Management

Notes repository

PYQ datasets

Topic categorization

Metadata storage

🎓 Student Friendly UI

Clean dashboard

Fast search experience

Organized resources

Mobile responsive design

🏗️ System Architecture
Frontend (React + Vite)
        │
        │ API Calls
        ▼
Backend (Node.js + Express)
        │
        ├── Gemini AI API
        ├── SQLite Database
        └── Resource Dataset
🛠️ Tech Stack
Frontend

React

Vite

TypeScript

CSS

Backend

Node.js

Express.js

TypeScript

AI Integration

Google Gemini API

Database

SQLite

Deployment:
Railway

⚙️ Installation Guide
Prerequisites

Install:

Node.js

npm

Run Locally
1 Install dependencies
npm install
2 Setup environment variables

Create .env file:
GEMINI_API_KEY=your_api_key_here
3 Run development server
npm run dev
4 Start backend
npm start


🌍 Deployment (Railway)
Steps followed:

1 Push project to GitHub

2 Create Railway project

3 Connect GitHub repo

4 Add environment variables:

GEMINI_API_KEY=your_key

5 Build command:

npm install && npm run build

6 Start command:

npm start

7 Deploy 🚀



📊 Future Improvements

User authentication

Resource upload by students

Rating system

Recommendation engine

Vector search (RAG)

Cloud database

Faculty resource verification



🎯 Use Cases

Exam preparation

Last minute revision

PYQ practice

Concept clarification

Academic resource discovery


👨‍💻 Author

Lakku Dheeraj Reddy

P E K KAUSHIK

BTech CSE – GITAM University



⭐ Contribution

Contributions are welcome!

If you want to improve this project:

1 Fork repo
2 Create feature branch
3 Commit changes
4 Open PR

📜 License

This project is for academic and educational purposes.

⚡ Project Vision:
To build a central AI powered academic ecosystem where students never struggle to find the right resource at the right time.
