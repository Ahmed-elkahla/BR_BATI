import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { dataApi } from "../api/auth";

const EMPTY_REG = { firstName: "", lastName: "", email: "", phone: "", password: "", confirm: "" };

export default function LoginPage({ onClose, onSuccess, defaultMode = "login" }) {
  const { login } = useAuth();
  const [mode, setMode]       = useState(defaultMode);
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [reg, setReg]         = useState(EMPTY_REG);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  function switchMode(m) { setMode(m); setError(""); }

  async function handleLogin(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      setError(err.message ?? "Erreur de connexion");
    } finally { setLoading(false); }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (reg.password !== reg.confirm) return setError("Les mots de passe ne correspondent pas");
    setError(""); setLoading(true);
    try {
      await dataApi.register({ firstName: reg.firstName, lastName: reg.lastName, email: reg.email, phone: reg.phone, password: reg.password });
      // auto-login after register
      await login(reg.email, reg.password);
      onSuccess?.();
    } catch (err) {
      setError(err.message ?? "Erreur lors de l'inscription");
    } finally { setLoading(false); }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✖</button>

        {/* Tabs */}
        <div className="auth-tabs">
          <button className={mode === "login" ? "auth-tab active" : "auth-tab"} onClick={() => switchMode("login")}>
            Connexion
          </button>
          <button className={mode === "register" ? "auth-tab active" : "auth-tab"} onClick={() => switchMode("register")}>
            S'inscrire
          </button>
        </div>

        {mode === "login" ? (
          <>
            <p className="modal-sub">Accédez à votre espace client</p>
            <form onSubmit={handleLogin}>
              <label>Email</label>
              <input type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
              <label>Mot de passe</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Connexion…" : "Se connecter"}
              </button>
            </form>
            <p className="auth-switch">
              Pas encore de compte ?{" "}
              <button className="auth-switch-btn" onClick={() => switchMode("register")}>S'inscrire</button>
            </p>
          </>
        ) : (
          <>
            <p className="modal-sub">Créez votre espace client gratuitement</p>
            <form onSubmit={handleRegister}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label>Prénom</label>
                  <input value={reg.firstName} onChange={(e) => setReg({ ...reg, firstName: e.target.value })} required />
                </div>
                <div>
                  <label>Nom</label>
                  <input value={reg.lastName} onChange={(e) => setReg({ ...reg, lastName: e.target.value })} required />
                </div>
              </div>
              <label>Email</label>
              <input type="email" value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} required />
              <label>Téléphone</label>
              <input value={reg.phone} onChange={(e) => setReg({ ...reg, phone: e.target.value })} placeholder="+213..." />
              <label>Mot de passe</label>
              <input type="password" value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })} required minLength={6} />
              <label>Confirmer le mot de passe</label>
              <input type="password" value={reg.confirm} onChange={(e) => setReg({ ...reg, confirm: e.target.value })} required minLength={6} />
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Inscription…" : "Créer mon compte"}
              </button>
            </form>
            <p className="auth-switch">
              Déjà un compte ?{" "}
              <button className="auth-switch-btn" onClick={() => switchMode("login")}>Se connecter</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
