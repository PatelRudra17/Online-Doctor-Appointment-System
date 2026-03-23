# KIVI Health - Clinic Management System

A modern, full-stack clinic management system built with React and Node.js.

## 📁 Project Structure

```
project-main/
├── frontend/          # React frontend application
│   ├── public/        # Static assets
│   ├── src/          # Source code
│   │   ├── api/      # API functions
│   │   ├── components/ # React components
│   │   ├── pages/     # Page components
│   │   ├── contexts/  # React contexts
│   │   ├── layouts/   # Layout components
│   │   ├── store/     # State management
│   │   └── data/      # Mock data
│   ├── package.json
│   └── vite.config.js
│
└── backend/           # Node.js backend application
    ├── src/           # Source code
    │   ├── controllers/ # Route controllers
    │   ├── models/     # Database models
    │   ├── routes/     # API routes
    │   ├── middleware/  # Express middleware
    │   ├── utils/      # Utility functions
    │   └── config/     # Configuration files
    ├── uploads/        # File uploads
    ├── package.json
    └── .env
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-main
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   - Copy `backend/.env.example` to `backend/.env`
   - Update the environment variables as needed

5. **Database Setup**
   - Make sure MongoDB is running
   - The seed script will create initial data

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:5000`

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Seed Database (Optional)**
   ```bash
   cd backend
   node seed-db.js
   ```
   This will create sample data for testing.

## 📱 Features

- **Authentication**: Secure login system with JWT
- **Dashboard**: Overview of clinic operations
- **Appointment Management**: Schedule and manage appointments
- **Patient Management**: Patient records and history
- **Clinic Settings**: Configure clinic procedures and settings
- **Profile Management**: User profile management
- **Real-time Updates**: Live data synchronization

## 🔐 Default Login Credentials

After seeding the database:

- **Admin**: `admin@demo.com` / `admin1234`
- **Doctor**: `doctor@demo.com` / `demo1234`

## 🛠️ Technologies

### Frontend
- React 18
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer (file uploads)

## 📝 API Documentation

The API runs on `http://localhost:5000/api` and includes endpoints for:
- Authentication (`/auth`)
- Appointments (`/appointments`)
- Templates (`/templates`)
- Dashboard (`/dashboard`)
- Profile (`/profile`)
- Development (`/dev`)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
