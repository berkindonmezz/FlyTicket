# FlyTicket - Flight Ticket Booking System

## Project Summary and Purpose
The FlyTicket project is a full-stack web application developed for an airline company. This project was designed as the final assignment for the CENG-3502 Dynamic Web Programming course.

The main objective of the system is to allow customers to easily search for flights and book tickets, while providing administrators with a secure infrastructure to manage the flight network.

The project was built following modern web development standards, covering both backend architecture and frontend design.

---

## Core Features

The system consists of two main modules:

### Customer (User) Side
- Dynamic flight search engine (filtering by origin, destination, and date)
- Ticket booking with passenger information
- Visual ticket confirmation (Boarding Pass) after successful booking
- Automatic E-Ticket delivery via email after purchase

### Admin Side
- Secure admin login panel
- CRUD operations for flights
- Conflict validation system:
  - Prevents flights departing from the same city at the same time
  - Prevents flights arriving at the same city at the same time
- Passenger and ticket management for each flight

---

## Technologies Used

### Frontend
- React.js
- Tailwind CSS
- Responsive design

### Backend
- Node.js
- Express.js

### Database
- MySQL
- Relational database structure:
  - City
  - Flight
  - Ticket
  - Admin tables

### Email Service
- Nodemailer
- SMTP integration

---

## Installation and Setup Guide

Follow the steps below to run the project locally.

### 1. Database Setup

1. Download the SQL file located in the root directory of the repository.
2. Create a new database in MySQL.
3. Import the SQL file into your database.

---

### 2. Backend (Server) Setup

Open a terminal and navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder and add the following variables:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=flyticket_db

JWT_SECRET=your_jwt_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Start the backend server:

```bash
npm start
```

The server will run on:

```txt
http://localhost:5000
```

---

### 3. Frontend (Client) Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

The application will run on:

```txt
http://localhost:3000
```

---

## Admin Login Credentials

You can use the following credentials to access the admin panel:

```txt
Username: admin
Password: admin
```

---

## Project Structure

```txt
FlyTicket/
│
├── flyticket-backend/
│   ├──src
│     ├── routes/
│     ├── controllers/
│     ├── config/
│     ├── utils/
│     ├── middleware/
│     └── app.js
│
├── flyticket-frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── flyticket_db_data.sql
└── README.md
```

---

## Future Improvements

- Online payment integration
- Flight seat selection system
- User authentication system
- Ticket cancellation and refund support
- Multi-language support
- Advanced admin analytics dashboard

---

## Course Information

This project was developed as part of the **CENG-3502 Dynamic Web Programming** course.
