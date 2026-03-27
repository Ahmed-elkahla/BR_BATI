import { useAuth } from "../context/AuthContext";

export default function Navbar({ onLoginClick, onRegisterClick }) {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="logo">
        <div className="icon">🏗️</div>
        <div>
          <h2>BâtiPro</h2>
          <span>Architecture & Construction</span>
        </div>
      </div>

      <nav>
        <a className="active" href="#">Accueil</a>
        <a href="#">Services</a>
        <a href="#">Réalisations</a>
        <a href="#">Demander un devis</a>
        <a href="#">Contact</a>
      </nav>

      {user ? (
        <div className="user-info">
          <span className="user-badge">
            {user.role === "ADMIN" ? "👑" : "👤"} {user.firstName}
          </span>
          <button className="btn-logout" onClick={logout}>Déconnexion</button>
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
