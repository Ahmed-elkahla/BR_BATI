import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const BASE = "http://localhost:4000/api";

export default function VerifyEmailPage() {
  const [params]   = useSearchParams();
  const navigate   = useNavigate();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = params.get("token");
    if (!token) { setStatus("error"); setMessage("Lien invalide."); return; }

    fetch(`${BASE}/verify-email?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.message === "Email confirmé avec succès") {
          setStatus("success");
        } else {
          setStatus("error");
          setMessage(data.message ?? "Lien invalide ou expiré.");
        }
      })
      .catch(() => { setStatus("error"); setMessage("Impossible de contacter le serveur."); });
  }, []);

  return (
    <div style={overlay}>
      <div style={card}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>
          {status === "loading" && "⏳"}
          {status === "success" && "✅"}
          {status === "error"   && "❌"}
        </div>

        {status === "loading" && (
          <>
            <h2 style={title}>Vérification en cours…</h2>
            <p style={sub}>Veuillez patienter.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 style={title}>Email confirmé !</h2>
            <p style={sub}>Votre compte est maintenant actif. Vous pouvez vous connecter.</p>
            <button style={btn} onClick={() => navigate("/")}>Se connecter</button>
          </>
        )}

        {status === "error" && (
          <>
            <h2 style={{ ...title, color: "#ef4444" }}>Lien invalide</h2>
            <p style={sub}>{message}</p>
            <button style={btn} onClick={() => navigate("/")}>Retour à l'accueil</button>
          </>
        )}
      </div>
    </div>
  );
}

const overlay = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" };
const card    = { background: "#fff", borderRadius: 16, padding: "48px 40px", textAlign: "center", maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" };
const title   = { fontSize: 22, fontWeight: 700, color: "#1a2236", marginBottom: 10 };
const sub     = { color: "#64748b", fontSize: 14, lineHeight: 1.6, marginBottom: 24 };
const btn     = { background: "#f97316", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" };
