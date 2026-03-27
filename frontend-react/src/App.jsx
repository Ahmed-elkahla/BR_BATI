import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PublicLayout from "./components/PublicLayout";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Services from "./components/Services";
import Projects from "./components/Projects";
import ServicesPage    from "./pages/ServicesPage";
import RealisationsPage from "./pages/RealisationsPage";
import DevisPage       from "./pages/DevisPage";
import ContactPage     from "./pages/ContactPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ProtectedRoute  from "./components/ProtectedRoute";
import AdminDashboard  from "./dashboard/AdminDashboard";
import UsersPage       from "./dashboard/UsersPage";
import ProjectsPage    from "./dashboard/ProjectsPage";
import ClientDashboard from "./dashboard/ClientDashboard";
import ClientProjectsPage from "./dashboard/ClientProjectsPage";
import "./index.css";

function HomePage() {
  const { user } = useAuth();
  if (user) return <Navigate to={user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/client"} replace />;
  return (
    <PublicLayout>
      <Hero />
      <Stats />
      <Services />
      <Projects />
    </PublicLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public pages */}
          <Route path="/"             element={<HomePage />} />
          <Route path="/services"     element={<PublicLayout><ServicesPage /></PublicLayout>} />
          <Route path="/realisations" element={<PublicLayout><RealisationsPage /></PublicLayout>} />
          <Route path="/devis"        element={<PublicLayout><DevisPage /></PublicLayout>} />
          <Route path="/contact"      element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Admin */}
          <Route path="/dashboard/admin/*" element={
            <ProtectedRoute role="ADMIN">
              <Routes>
                <Route index          element={<AdminDashboard />} />
                <Route path="users"    element={<UsersPage />} />
                <Route path="projects" element={<ProjectsPage />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Client */}
          <Route path="/dashboard/client/*" element={
            <ProtectedRoute role="CLIENT">
              <Routes>
                <Route index           element={<ClientDashboard />} />
                <Route path="projects" element={<ClientProjectsPage />} />
              </Routes>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
