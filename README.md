# 🌟 Learnlink - English Learning Website & Community Platform

Learnlink is a comprehensive English learning platform built with modern web technologies. Students can access courses, participate in community discussions, track their learning progress, and connect with certified instructors. The platform features interactive lessons, real-time chat, progress analytics, and a vibrant learning community.

* ⚙️ Backend: NestJS (TypeScript)
* 🌐 Frontend: Angular 18+ (TypeScript)
* 🐳 Docker: For containerized development and deployment
* 📬 Email integration: Course notifications and progress updates
* 💬 Real-time chat: Community discussions and instructor support

---

## 📁 Project Structure
```
LearnLink-english-platform/
│
├── frontend/         # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── landing/
│   │   │   │   ├── courses/
│   │   │   │   ├── community/
│   │   │   │   └── shared/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── guards/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── styles/
│   │   └── environments/
│   ├── angular.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── backend/          # NestJS backend API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── courses/
│   │   │   ├── community/
│   │   │   └── progress/
│   │   ├── common/
│   │   │   ├── guards/
│   │   │   ├── decorators/
│   │   │   └── pipes/
│   │   └── database/
│   ├── test/
│   ├── Dockerfile
│   └── package.json
│
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 👥 Team Roles & Responsibilities

| Name                | Role & Branch               | Task Description                                     |
| ------------------- | --------------------------- | ---------------------------------------------------- |
| **[Group 1]**     | `feature/lead-coordination` | Project coordination, Docker setup, CI/CD pipeline |
| **[Alex  Muhoro]** | `feature/landing-page`     | Landing page, hero section, testimonials UI        |
| **[Elizabeth ]** | `feature/courses-ui`       | Course catalog, course detail pages, enrollment UI  |
| **[Jimmy Kimunyi]**  | `feature/auth-api`         | Authentication, user management, JWT implementation |
| **[Jimmy Kimunyi]**  | `feature/courses-api`      | Course management, progress tracking, analytics API |
| **[Group 1]** | `feature/community-chat`   | Community features, real-time chat, forums         |

---

## 🐳 Docker Setup Guide

Ensure you have Docker installed:
👉 [Download Docker](https://www.docker.com/products/docker-desktop)

### ⚡ Backend (NestJS)
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Build backend image
docker build -t LearnLink-backend .

# Run backend container
docker run -p 3000:3000 LearnLink-backend
```
API will be available at: [http://localhost:3000](http://localhost:3000)

### 🌐 Frontend (Angular)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build frontend image
docker build -t LearnLink-frontend .

# Run frontend container
docker run -p 4200:4200 LearnLink-frontend
```
Frontend will be available at: [http://localhost:4200](http://localhost:4200)

### 🧩 Run Full Stack with Docker Compose
```bash
# Navigate to project root
cd LearnLink-english-platform

# Start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# Stop all services
docker-compose down
```

**Services URLs:**
- Frontend: [http://localhost:4200](http://localhost:4200)
- Backend API: [http://localhost:3000](http://localhost:3000)
- Database: [http://localhost:5432](http://localhost:5432)

---

## 🔧 Git Workflow Guide

### 📌 1. Clone the Repository
```bash
git clone <REPO_URL>
cd LearnLink-english-platform
```

### 📌 2. Checkout Your Branch
```bash
git checkout -b feature/<your-name>-<your-area> origin/feature/<your-name>-<your-area>
```

**Examples:**
```bash
git checkout -b feature/john-landing-page origin/feature/john-landing-page
git checkout -b feature/sarah-auth-api origin/feature/sarah-auth-api
git checkout -b feature/mike-courses-ui origin/feature/mike-courses-ui
```

### 📌 3. Daily Workflow
```bash
# Pull latest changes from dev
git pull origin dev

# Make your changes and stage them
git add .

# Commit with descriptive message
git commit -m "feat: add responsive hero section to landing page"

# Push to your feature branch
git push origin feature/<your-name>-<your-area>
```

### 📌 4. Create Pull Request
1. Go to GitHub repository
2. Click "New Pull Request"
3. Select: `feature/<your-branch>` ➔ `dev`
4. Add clear description of changes
5. Request review from team members
6. Wait for approval before merging

---

## 🚀 Development Commands

### Frontend (Angular)
```bash
cd frontend

# Development server
ng serve

# Build for production
ng build --prod

# Run tests
ng test

# Generate component
ng generate component components/course-card

# Generate service
ng generate service services/course
```

### Backend (NestJS)
```bash
cd backend

# Development server
npm run start:dev

# Build for production
npm run build

# Run tests
npm run test

# Generate module
nest generate module courses

# Generate controller
nest generate controller courses

# Generate service
nest generate service courses
```

---

## 📋 Project Features

### 🎯 Core Features
- **Landing Page**: Hero section, course overview, instructor profiles
- **Course Catalog**: Browse and filter available English courses
- **User Authentication**: Registration, login, profile management
- **Course Enrollment**: Secure payment integration and enrollment
- **Progress Tracking**: Visual progress indicators and analytics
- **Community Forum**: Discussion boards and peer interaction
- **Real-time Chat**: Live chat with instructors and students

### 🔮 Advanced Features
- **Adaptive Learning**: Personalized course recommendations
- **Video Lessons**: Integrated video player with subtitles
- **Quiz System**: Interactive assessments and instant feedback
- **Certificates**: Downloadable completion certificates
- **Mobile App**: Progressive Web App (PWA) support
- **Multi-language**: Support for multiple interface languages

---

## 💡 Tips for Team Members

* **Code Standards**: Follow Angular and NestJS best practices
* **Component Design**: Keep components small and reusable
* **API Design**: Use RESTful conventions and proper HTTP status codes
* **Testing**: Write unit tests for critical functionality
* **Documentation**: Comment complex logic and update README
* **Responsive Design**: Ensure mobile-first approach
* **Performance**: Optimize images and implement lazy loading

---

## 📩 Communication & Coordination

### Daily Standup (9:00 AM)
- What did you work on yesterday?
- What are you working on today?
- Any blockers or challenges?

### Weekly Review (Fridays)
- Demo completed features
- Code review sessions
- Plan next week's tasks

### Communication Channels
- **Slack/Discord**: Daily communication
- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code reviews and discussions

---

## 🔐 Environment Setup

### Required Environment Variables
```bash
# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/LearnLink_db
JWT_SECRET=your-super-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend (environment.ts)
API_URL=http://localhost:3000
PRODUCTION=false
```

---

## 🎨 Design System

### Color Palette
- **Primary**: #20B2AA (Turquoise)
- **Secondary**: #4A90E2 (Blue)
- **Accent**: #F39C12 (Orange)
- **Success**: #27AE60 (Green)
- **Warning**: #F1C40F (Yellow)
- **Error**: #E74C3C (Red)

### Typography
- **Headings**: Inter, sans-serif
- **Body**: Open Sans, sans-serif
- **Code**: Fira Code, monospace

---

> 🎓 "Education is the passport to the future, for tomorrow belongs to those who prepare for it today." – Malcolm X

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

