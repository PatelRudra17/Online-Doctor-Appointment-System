import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import SpecialtyGrid from './components/SpecialtyGrid';
import FeatureSection from './components/FeatureSection';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import DoctorDetails from './components/Auth/DoctorDetails';
import CreateAccount from './components/Auth/CreateAccount';
import ClinicDetailsPage1 from './components/Auth/ClinicDetailsPage1';
import ClinicLocationPage1 from './components/Auth/ClinicLocationPage1';
import ClinicLocationPage2 from './components/Auth/ClinicLocationPage2';
import ClinicTimings from './components/Auth/ClinicTimings';
import Verification from './components/Auth/Verification';
import VerifyCode from './components/Auth/VerifyCode';
import ConsultationFees from './components/Auth/ConsultationFees';
import Dashboard from './components/Dashboard';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

import DashboardPage from './pages/dashboard/DashboardPage';
import CalendarPage from './pages/calendar/CalendarPage';
import VideoGuidePage from './pages/video-guide/VideoGuidePage';
import KiviAIPage from './pages/kivi-ai/KiviAIPage';
import ProfilePage from './pages/profile/ProfilePage';
import ClinicSettingsPage from './pages/clinic-settings/ClinicSettingsPage';
import MenuPage from './pages/menu/MenuPage';
import AbdmPage from './pages/abdm/AbdmPage';
import KiviConsultPage from './pages/kivi-consult/KiviConsultPage';
import DataImportPage from './pages/menu/subpages/DataImportPage';
import NotificationsPage from './pages/menu/subpages/NotificationsPage';
import ReportsPage from './pages/menu/subpages/ReportsPage';
import NotFound from './components/NotFound';

// Wizard pages
import { 
  ActivateProfilePage, 
  VerificationPage, 
  PersonalDetailsPage, 
  ConsultationDetailsPage, 
  SuccessPage 
} from './pages/activate-profile';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <div className="App">
                <Header />
                <main>
                  <Hero />
                  <SpecialtyGrid />
                  <FeatureSection />
                </main>
                <Footer />
                <ChatBot />
              </div>
            } />
            
            {/* Authentication routes */}
            <Route path="/auth/doctor-details" element={<DoctorDetails />} />
            <Route path="/auth/create-account" element={<CreateAccount />} />
            <Route path="/auth/clinic-details-1" element={<ClinicDetailsPage1 />} />
            <Route path="/auth/clinic-location-1" element={<ClinicLocationPage1 />} />
            <Route path="/auth/clinic-location-2" element={<ClinicLocationPage2 />} />
            <Route path="/auth/clinic-timings" element={<ClinicTimings />} />
            <Route path="/auth/verification" element={<Verification />} />
            <Route path="/auth/verify-code" element={<VerifyCode />} />
            <Route path="/auth/consultation-fees" element={<ConsultationFees />} />
            <Route path="/auth/login" element={<Login />} />
            
            {/* Protected routes with AppLayout */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/video-guide" element={<VideoGuidePage />} />
              <Route path="/kivi-consult" element={<KiviConsultPage />} />
              <Route path="/abdm" element={<AbdmPage />} />
              <Route path="/kivi-ai" element={<KiviAIPage />} />
              <Route path="/activate-profile" element={<ActivateProfilePage />} />
              <Route path="/activate-profile/verification" element={<VerificationPage />} />
              <Route path="/activate-profile/personal" element={<PersonalDetailsPage />} />
              <Route path="/activate-profile/consultation" element={<ConsultationDetailsPage />} />
              <Route path="/activate-profile/success" element={<SuccessPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/clinic-settings" element={<ClinicSettingsPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/menu/subpages/data-import" element={<DataImportPage />} />
              <Route path="/menu/subpages/notifications" element={<NotificationsPage />} />
              <Route path="/menu/subpages/reports" element={<ReportsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
