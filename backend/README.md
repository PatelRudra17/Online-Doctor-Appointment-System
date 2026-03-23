# Backend - KIVI Health Clinic Management System

Node.js backend API for the KIVI Health clinic management system.

## 📁 Structure

```
backend/
├── src/                    # Source code
│   ├── controllers/         # Route controllers
│   │   ├── auth.controller.js
│   │   ├── appointments.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── profile.controller.js
│   │   ├── templates.controller.js
│   │   └── dev.controller.js
│   ├── models/             # Database models
│   │   ├── User.js
│   │   ├── Clinic.js
│   │   ├── DoctorProfile.js
│   │   ├── Appointment.js
│   │   └── TemplateProcedure.js
│   ├── routes/             # API routes
│   │   ├── auth.routes.js
│   │   ├── appointments.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── profile.routes.js
│   │   ├── templates.routes.js
│   │   └── dev.routes.js
│   ├── middleware/         # Express middleware
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── upload.middleware.js
│   │   └── validate.middleware.js
│   ├── utils/              # Utility functions
│   │   ├── apiResponse.js
│   │   ├── jwt.js
│   │   └── password.js
│   ├── config/             # Configuration files
│   │   └── db.js
│   ├── app.js              # Express app configuration
│   └── server.js          # Server entry point
├── uploads/                # File upload directory
├── package.json
├── .env                   # Environment variables
└── seed-db.js            # Database seeding script
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Update .env with your configuration
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Seed database (optional)**
   ```bash
   node seed-db.js
   ```

## 🔧 Configuration

### Environment Variables

Key environment variables in `.env`:

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRE` - JWT expiration time
- `FRONTEND_URL` - Frontend URL for CORS

### Database

The application uses MongoDB with Mongoose ODM. Make sure MongoDB is running before starting the server.

## 📱 API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - User login
- `GET /me` - Get current user
- `POST /refresh` - Refresh token
- `POST /logout` - User logout
- `POST /change-password` - Change password

### Appointments (`/api/appointments`)
- `GET /` - Get appointments
- `POST /` - Create appointment
- `PUT /:id` - Update appointment
- `DELETE /:id` - Delete appointment

### Templates (`/api/templates`)
- `GET /procedures` - Get procedures
- `POST /procedures` - Create procedure
- `PUT /procedures/:id` - Update procedure
- `DELETE /procedures/:id` - Delete procedure
- `PUT /procedures/reorder` - Reorder procedures

### Dashboard (`/api/dashboard`)
- `GET /` - Get dashboard data

### Profile (`/api/profile`)
- `GET /` - Get profile
- `PUT /` - Update profile

### Development (`/api/dev`)
- `POST /seed` - Seed development data
- `DELETE /seed` - Clear development data

## 🛠️ Technologies

- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- Multer for file uploads
- Express middleware for validation and error handling

## 🔐 Default Users

After running the seed script:

- **Admin**: `admin@demo.com` / `admin123`
- **Doctor**: `doctor@demo.com` / `demo123`

## 📝 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `node seed-db.js` - Seed database with sample data

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Request validation
- CORS configuration
- File upload security
- Rate limiting (if configured)

## 📊 Database Models

- **User**: User accounts and authentication
- **Clinic**: Clinic information and settings
- **DoctorProfile**: Doctor professional information
- **Appointment**: Patient appointments
- **TemplateProcedure**: Clinic procedure templates
