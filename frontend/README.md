# Frontend - KIVI Health Clinic Management System

React frontend application for the KIVI Health clinic management system.

## 📁 Structure

```
frontend/
├── public/           # Static assets
├── src/             # Source code
│   ├── api/         # API functions and client configuration
│   ├── components/   # Reusable React components
│   ├── pages/       # Page components
│   ├── contexts/    # React contexts for state management
│   ├── layouts/     # Layout components
│   ├── store/       # Redux store configuration
│   └── data/       # Mock data and constants
├── package.json
└── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

The frontend is configured to connect to the backend API at `http://localhost:5000/api`. This can be updated in `src/api/client.js`.

## 📱 Features

- **Authentication**: Login, logout, and token management
- **Dashboard**: Clinic overview and statistics
- **Appointments**: Schedule and manage appointments
- **Clinic Settings**: Manage procedures and clinic configuration
- **Profile**: User profile management
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technologies

- React 18 with hooks
- Vite for development and building
- Tailwind CSS for styling
- Redux Toolkit for state management
- React Router for navigation
- Axios for API communication

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Login

Use the following credentials to login:
- Email: `doctor@demo.com` or `admin@demo.com`
- Password: `demo1234` or `admin1234` respectively

Make sure the backend server is running on `http://localhost:5000` before attempting to login.
