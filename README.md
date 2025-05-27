# Knowledge Sharing Platform

A collaborative platform for sharing and discovering knowledge.

## Features

- User registration and login
- Post articles, questions, and answers
- Comment on posts and articles
- Admin/author post versioning (view previous versions)
- AI-powered article summarization

## Setup Instructions

- Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
- Install [Docker](https://www.docker.com/) if you wish to use containerization.
- Configure environment variables as needed in the `backend/.env` and `frontend/.env` files.

## Docker Commands to Run the Project

1. Build and start the containers:
    ```bash
    docker-compose up --build
    ```
2. To stop the containers:
    ```bash
    docker-compose down
    ```

## API Endpoint Documentation

| Method | Endpoint               | Description                   |
|--------|------------------------|--------------------------------|
| POST   | `/api/auth/register`   | Register a new user            |
| POST   | `/api/auth/login`      | User login                     |
| GET    | `/api/posts`           | Get all posts                  |
| POST   | `/api/posts`           | Create a new post              |
| GET    | `/api/posts/:id`       | Get a specific post            |
| PUT    | `/api/posts/:id`       | Update a post                  |
| DELETE | `/api/posts/:id`       | Delete a post                  |
| POST   | `/api/comments`        | Add a comment                  |
| GET    | `/api/posts/:id`       | Get post version history       |
| POST   | `/api/summarize/:id`   | Summarize an article (AI)      |

## Sample Login Credentials for Testing

| Role   | Email                | Password   |
|--------|----------------------|------------|
| Admin  | admin@example.com    | admin123   |
| Author | author@example.com   | author123  |
| User   | user@example.com     | user123    |

> These credentials you can use after registration, because currently not availble credentials in my database.


## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/knowledge-sharing-platform.git
   ```
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
   Create .env file and add the below infromation
    DB_NAME=knowledge_sharing_platform  
    JWT_SECRET=your_jwt_secret_here  
    GEMINI_API_KEY=your_ai_api_key  

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
4. Start the backend server:
   ```bash
   cd ../backend
   npm start
   ```
5. Start the frontend development server:
   ```bash
   cd ../frontend
   npm run dev
   ```

