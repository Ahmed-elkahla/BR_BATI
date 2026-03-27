import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Services from "./components/Services";
import Projects from "./components/Projects";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./dashboard/AdminDashboard";
import UsersPage from "./dashboard/UsersPage";
import ProjectsPage from "./dashboard/ProjectsPage";
import ClientDashboard from "./dashboard/ClientDashboard";
import "./index.css";

function HomePage() {
  const { user } = useAuth();
  const [authMode, setAuthMode] = useState(null); // null | "login" | "register"
  const navigate = useNavigate();

  if (user) {
    return <Navigate to={user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/client"} replace />;
  }

  function handleLoginSuccess() { setAuthMode(null); }

  return (
    <>
      <Navbar onLoginClick={() => setAuthMode("login")} onRegisterClick={() => setAuthMode("register")} />
      <Hero />
      <Stats />
      <Services />
      <Projects />
      {authMode && <LoginPage defaultMode={authMode} onClose={() => setAuthMode(null)} onSuccess={handleLoginSuccess} />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/dashboard/admin/*"
            element={
              <ProtectedRoute role="ADMIN">
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="projects" element={<ProjectsPage />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/client/*"
            element={
              <ProtectedRoute role="CLIENT">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
