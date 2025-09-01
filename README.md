SprintSync - AI-Powered Task Management System
SprintSync is an internal task management tool for AI consultancy teams, featuring AI-powered task suggestions and time tracking.

Loom video recording link: https://www.loom.com/share/7416e022ec684bc3b7fcab71ded1e013?sid=531b0349-92e1-4e75-a859-6eba1ed93a1c

Features:
*Task Management: Kanban board with drag-and-drop functionality

*AI Integration: GPT-powered task description suggestions

*Time Tracking: Log time spent on tasks with analytics

*User Authentication: JWT-based secure login/registration

*Responsive Design: Built with Ant Design and React

Tech Stack:
*Backend

*Node.js + Express.js

*Prisma ORM with SQLite

*JWT Authentication

*OpenAI API integration

*Swagger/OpenAPI documentation

Frontend:
*React 18 with Vite

*Ant Design UI components

*React Beautiful DnD for drag-and-drop

*Recharts for analytics

*Axios for API calls

Installation
Prerequisites
*Node.js 18+

*Docker and Docker Compose

*OpenAI API key (for AI features)

Clone and setup:

bash
git clone <your-repo>
cd sprint-sync


Configure environment:

bash
# Backend .env file
echo "DATABASE_URL=\"file:./dev.db\"" > backend/.env
echo "JWT_SECRET=\"$(openssl rand -base64 64)\"" >> backend/.env
echo "OPENAI_API_KEY=\"your-openai-key-here\"" >> backend/.env
Start with Docker:

bash
docker-compose up --build
Access the application:

Frontend: http://localhost:5173

Backend API: http://localhost:5000

API Docs: http://localhost:5000/api-docs

Manual Installation
Backend Setup:

bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
Frontend Setup:

bash
cd frontend
npm install
npm run dev

 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	User registration
POST	/api/auth/login	User login
GET	/api/tasks	Get user tasks
POST	/api/tasks	Create new task
PUT	/api/tasks/:id	Update task
DELETE	/api/tasks/:id	Delete task
POST	/api/ai/suggest	Get AI task suggestion

Docker Commands
bash
# Start all services
docker-compose up

# Build and start
docker-compose up --build

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
# Start and Stop containers
docker-compose start
docker-compose stop

