import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import PublicLayout from './components/Layouts/PublicLayout';
import AdminLayout from './components/Layouts/AdminLayout';
import UserLayout from './components/Layouts/UserLayout';
import { AdminRoute, UserRoute } from './components/ProtectedRoutes/ProtectedRoutes';
import ScrollTop from './components/ScrollTop/ScrollTop';
import HomePage from './pages/Public/HomePage';
import Login from './pages/Auth/Login';
import ResetPassword from './pages/Auth/ResetPassword';
import VerifyOTP from './pages/Auth/VerifyOTP';
import ChangePassword from './pages/Auth/ChangePassword';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminComplaintsPage from './pages/Admin/AdminComplaintsPage';
import AdminPublishNoticePage from './pages/Admin/AdminPublishNoticePage';
import AdminFeesPage from './pages/Admin/AdminFeesPage';
import AdminManageUsersPage from './pages/Admin/AdminManageUsersPage';
import AdminProfilePage from './pages/Admin/AdminProfilePage';
import UserProfile from './pages/User/UserProfile';
import ComplaintPage from './pages/User/ComplaintPage';
import NoticePage from './pages/User/NoticePage';
import Notice from './pages/Public/Notice';
import NoticeDetail from './pages/Public/NoticeDetail';
import Facilities from './pages/Public/Facilities';
import RoomAllocation from './pages/Public/RoomAllocation';
import Contact  from  './pages/Public/Contact';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          duration={3000}
        />
        <ScrollTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="notice" element={<Notice />} />
            <Route path="notice/:id" element={<NoticeDetail />} />
            <Route path="facilities" element={<Facilities />} />
            <Route path="room-allocation" element={<RoomAllocation />} />
             <Route path="contact" element={<Contact />} />
          </Route>

          {/* Auth Routes (without layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/change-password" element={<ChangePassword />} />


          {/* Admin Routes (Protected) */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="complaints" element={<AdminComplaintsPage />} />
            <Route path="publish-notice" element={<AdminPublishNoticePage />} />
            <Route path="fees" element={<AdminFeesPage />} />
            <Route path="manage-users" element={<AdminManageUsersPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
          </Route>

          {/* User Routes (Protected) */}
          <Route path="/user" element={<UserRoute><UserLayout /></UserRoute>}>
            <Route path="profile" element={<UserProfile />} />
            <Route path="complaint" element={<ComplaintPage />} />
            <Route path="notices" element={<NoticePage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<div className="p-8 text-center min-h-screen flex items-center justify-center bg-gray-100"><h1 className="text-2xl font-bold text-gray-800">404 - Page Not Found</h1></div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
