import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onLoginClick, onRegisterClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <NavLink to="/" className="logo" style={{ textDecoration: "none" }}>
        <div className="icon">🏗️</div>
        <div>
          <h2>BâtiPro</h2>
          <span>Architecture & Construction</span>
        </div>
      </NavLink>

      <nav>
        <NavLink to="/"            end className={({ isActive }) => isActive ? "active" : ""}>Accueil</NavLink>
        <NavLink to="/services"        className={({ isActive }) => isActive ? "active" : ""}>Services</NavLink>
        <NavLink to="/realisations"    className={({ isActive }) => isActive ? "active" : ""}>Réalisations</NavLink>
        <NavLink to="/devis"           className={({ isActive }) => isActive ? "active" : ""}>Demander un devis</NavLink>
        <NavLink to="/contact"         className={({ isActive }) => isActive ? "active" : ""}>Contact</NavLink>
      </nav>

      {user ? (
        <div className="user-info">
          <span className="user-badge">
            {user.role === "ADMIN" ? "👑" : "👤"} {user.firstName}
          </span>
          <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
        </div>
      ) : (
        <div className="nav-auth-btns">
          <button className="btn-login" onClick={onLoginClick}>Connexion</button>
          <button className="btn-client" onClick={onRegisterClick}>S'inscrire</button>
        </div>
      )}
    </header>
  );
}
