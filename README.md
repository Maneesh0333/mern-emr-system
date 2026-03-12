# EMR System (Electronic Medical Record)
A full-stack MERN application for managing hospital appointments, doctor schedules, and patient records.

## Features
### Admin
- Manage doctors
- Enable / disable doctors
- View all appointments
- Update appointment status
- Dashboard overview

### Doctor
- View personal dashboard
- Manage availability schedule
- View appointments
- Complete or cancel appointments

### Receptionist
- Book appointments
- View today's appointments
- Manage patient details
- Check doctor availability

## Tech Stack
### Frontend
- React
- TypeScript
- TanStack Query (React Query)
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Environment Variables
Create a .env file inside the backend folder.
cd backend
touch .env

Add the following variables:
- MONGO_DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/EMRsystem
- PORT=5000
- FRONTEND_URL=http://localhost:5173
- REFRESH_TOKEN_SECRET=your_refresh_token_secret
- ACCESS_TOKEN_SECRET=your_access_token_secret
- NODE_ENV=development

## 🎥 Demo
https://github.com/user-attachments/assets/9670c676-f668-472e-9902-ba2074cc9185


