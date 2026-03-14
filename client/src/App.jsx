import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider }    from "./context/AuthContext";
import ProtectedRoute      from "./components/common/ProtectedRoute";

// Landing
import Landing             from "./pages/Landing";

// Auth
import Login               from "./pages/auth/Login";
import Register            from "./pages/auth/Register";

// Admin
import AdminDashboard      from "./pages/admin/AdminDashboard";
import ManageHostels       from "./pages/admin/ManageHostels";
import ManageBookings      from "./pages/admin/ManageBookings";
import AdminWaitingList    from "./pages/admin/WaitingListPage";

// Student
import StudentDashboard    from "./pages/student/StudentDashboard";
import HostelList          from "./pages/student/HostelList";
import HostelDetail        from "./pages/student/HostelDetail";
import BookingHistoryPage  from "./pages/student/BookingHistory";
import StudentWaitingPage  from "./pages/student/WaitingListPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ── Public ── */}
          <Route path="/"         element={<Landing />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Admin ── */}
          <Route path="/admin" element={
            <ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/hostels" element={
            <ProtectedRoute roles={["admin"]}><ManageHostels /></ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute roles={["admin"]}><ManageBookings /></ProtectedRoute>
          } />
          <Route path="/admin/waiting-list" element={
            <ProtectedRoute roles={["admin"]}><AdminWaitingList /></ProtectedRoute>
          } />

          {/* ── Student ── */}
          <Route path="/dashboard" element={
            <ProtectedRoute roles={["student"]}><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/hostels" element={
            <ProtectedRoute roles={["student"]}><HostelList /></ProtectedRoute>
          } />
          <Route path="/dashboard/hostels/:id" element={
            <ProtectedRoute roles={["student"]}><HostelDetail /></ProtectedRoute>
          } />
          <Route path="/dashboard/bookings" element={
            <ProtectedRoute roles={["student"]}><BookingHistoryPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/waiting" element={
            <ProtectedRoute roles={["student"]}><StudentWaitingPage /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}