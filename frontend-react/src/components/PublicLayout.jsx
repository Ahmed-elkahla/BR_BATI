import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import LoginPage from "../pages/LoginPage";

export default function PublicLayout({ children }) {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [authMode, setAuthMode] = useState(null);

  function handleLoginSuccess() {
    setAuthMode(null);
    navigate(user?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/client");
  }

  return (
    <>
      <Navbar onLoginClick={() => setAuthMode("login")} onRegisterClick={() => setAuthMode("register")} />
      <main>{children}</main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span style={{ fontSize: 28 }}>🏗️</span>
            <div>
              <h3>BâtiPro</h3>
              <p>Architecture & Construction</p>
            </div>
          </div>
          <div className="footer-links">
            <h4>Navigation</h4>
            <Link to="/">Accueil</Link>
            <Link to="/services">Services</Link>
            <Link to="/realisations">Réalisations</Link>
            <Link to="/devis">Demander un devis</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-links">
            <h4>Contact</h4>
            <span>📍 Tunis, Tunisie</span>
            <span>📞 +213 12 345 678</span>
            <span>✉️ contact@batipro.com</span>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} BâtiPro — Tous droits réservés
        </div>
      </footer>

      {authMode && (
        <LoginPage defaultMode={authMode} onClose={() => setAuthMode(null)} onSuccess={handleLoginSuccess} />
      )}
    </>
  );
}
