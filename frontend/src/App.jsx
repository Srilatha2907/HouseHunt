import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Common
import Home from './modules/common/Home';
import Login from './modules/common/Login';
import Register from './modules/common/Register';
import ForgotPassword from './modules/common/ForgotPassword';

// Renter (Tenant in DB)
import RenterHome from './modules/user/renter/RenterHome';
import AllPropertiesRenter from './modules/user/renter/AllProperties';
import PropertyDetails from './modules/user/renter/PropertyDetails';
import MyBookings from './modules/user/renter/MyBookings';

// Owner
import OwnerHome from './modules/user/owner/OwnerHome';
import AddProperty from './modules/user/owner/AddProperty';
import AllPropertiesOwner from './modules/user/owner/AllProperties';
import AllBookingsOwner from './modules/user/owner/AllBookings';

// Admin
import AdminHome from './modules/admin/AdminHome';
import AllUsers from './modules/admin/AllUsers';
import AllPropertyAdmin from './modules/admin/AllProperty';
import AllBookingsAdmin from './modules/admin/AllBookings';
import ApproveOwners from './modules/admin/ApproveOwners';

import Chat from './modules/common/Chat';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.userType)) {
    // Redirect to their respective dashboard if they try to access unauthorized route
    const rolePath = user.userType === 'Tenant' ? 'renter' : user.userType.toLowerCase();
    return <Navigate to={`/${rolePath}/dashboard`} replace />;
  }

  return children;
};

const GuestRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user) {
    const rolePath = user.userType === 'Tenant' ? 'renter' : user.userType.toLowerCase();
    return <Navigate to={`/${rolePath}/dashboard`} replace />;
  }

  return children;
};


function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1">
          <Routes>
            {/* Common Routes */}
            <Route path="/" element={<GuestRoute><Home /></GuestRoute>} />
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

            {/* Tenant Routes */}
            <Route path="/renter/dashboard" element={<ProtectedRoute allowedRoles={['Tenant']}><RenterHome /></ProtectedRoute>} />
            <Route path="/renter/properties" element={<ProtectedRoute allowedRoles={['Tenant']}><AllPropertiesRenter /></ProtectedRoute>} />
            <Route path="/renter/properties/:id" element={<ProtectedRoute allowedRoles={['Tenant']}><PropertyDetails /></ProtectedRoute>} />
            <Route path="/renter/bookings" element={<ProtectedRoute allowedRoles={['Tenant']}><MyBookings /></ProtectedRoute>} />

            {/* Owner Routes */}
            <Route path="/owner/dashboard" element={<ProtectedRoute allowedRoles={['Owner']}><OwnerHome /></ProtectedRoute>} />
            <Route path="/owner/properties" element={<ProtectedRoute allowedRoles={['Owner']}><AllPropertiesOwner /></ProtectedRoute>} />
            <Route path="/owner/add-property" element={<ProtectedRoute allowedRoles={['Owner']}><AddProperty /></ProtectedRoute>} />
            <Route path="/owner/bookings" element={<ProtectedRoute allowedRoles={['Owner']}><AllBookingsOwner /></ProtectedRoute>} />

            {/* Chat Route (Accessible by both Tenant and Owner) */}
            <Route path="/chat" element={<ProtectedRoute allowedRoles={['Tenant', 'Owner']}><Chat /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminHome /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AllUsers /></ProtectedRoute>} />
            <Route path="/admin/approve-owners" element={<ProtectedRoute allowedRoles={['admin']}><ApproveOwners /></ProtectedRoute>} />
            <Route path="/admin/properties" element={<ProtectedRoute allowedRoles={['admin']}><AllPropertyAdmin /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['admin']}><AllBookingsAdmin /></ProtectedRoute>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
