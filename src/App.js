import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext"; // Make sure this import is correct
import SignUp from "./SignUp";
import Login from "./Login";
import Dashboard from "./Dashboard";

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />; // If user exists, show children, else redirect
}

function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/dashboard" replace />; // If user does NOT exist, show children, else redirect
}

export default function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider wraps the entire app, providing auth state to all children */}
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/signup"
              element={
                // PublicRoute prevents logged-in users from seeing the sign-up page
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                // PublicRoute prevents logged-in users from seeing the login page
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                // PrivateRoute protects the dashboard from unauthenticated access
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
