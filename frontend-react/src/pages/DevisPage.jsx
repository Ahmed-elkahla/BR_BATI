import { useState } from "react";

const TYPES = ["Maison individuelle", "Immeuble résidentiel", "Bâtiment commercial", "Rénovation", "Extension", "Autre"];
const BUDGETS = ["Moins de 50 000 €", "50 000 – 150 000 €", "150 000 – 500 000 €", "500 000 – 1 000 000 €", "Plus de 1 000 000 €"];

const EMPTY = { firstName: "", lastName: "", email: "", phone: "", projectType: "", budget: "", location: "", description: "", timeline: "" };

export default function DevisPage() {
  const [form, setForm]       = useState(EMPTY);
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    // Simulate sending — replace with real API call when ready
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  }

  if (sent) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 480, padding: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 24, color: "#1a2236", marginBottom: 12 }}>Demande envoyée !</h2>
        <p style={{ color: "#64748b", lineHeight: 1.7, marginBottom: 24 }}>
          Merci <strong>{form.firstName}</strong>, votre demande de devis a bien été reçue.<br />
          Notre équipe vous contactera sous <strong>48 heures</strong>.
        </p>
        <button className="btn-orange" onClick={() => { setForm(EMPTY); setSent(false); }}>
          Nouvelle demande
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-content">
          <span className="page-hero-tag">Devis Gratuit</span>
          <h1>Obtenez votre devis en 48h</h1>
          <p>Décrivez votre projet et recevez une estimation personnalisée sans engagement.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="page-container" style={{ maxWidth: 860 }}>
          <div className="devis-layout">
            {/* FORM */}
            <form className="devis-form" onSubmit={handleSubmit}>
              <h3>Vos informations</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom *</label>
                  <input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Nom *</label>
                  <input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+213..." />
                </div>
              </div>

              <h3 style={{ marginTop: 24 }}>Votre projet</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Type de projet *</label>
                  <select value={form.projectType} onChange={(e) => set("projectType", e.target.value)} required>
                    <option value="">— Sélectionner —</option>
                    {TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Budget estimé</label>
                  <select value={form.budget} onChange={(e) => set("budget", e.target.value)}>
                    <option value="">— Sélectionner —</option>
                    {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Localisation</label>
                  <input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Ville, région…" />
                </div>
                <div className="form-group">
                  <label>Délai souhaité</label>
                  <input value={form.timeline} onChange={(e) => set("timeline", e.target.value)} placeholder="Ex: 6 mois, 2026…" />
                </div>
              </div>
              <div className="form-group">
                <label>Description du projet *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  required
                  rows={5}
                  placeholder="Décrivez votre projet : surface, nombre de pièces, matériaux souhaités, contraintes particulières…"
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading} style={{ marginTop: 8 }}>
                {loading ? "Envoi en cours…" : "Envoyer ma demande de devis"}
              </button>
            </form>

            {/* SIDEBAR INFO */}
            <aside className="devis-aside">
              <div className="devis-info-card">
                <div className="devis-info-icon"><i className="fa-solid fa-clock"></i></div>
                <h4>Réponse sous 48h</h4>
                <p>Notre équipe analyse votre demande et vous contacte rapidement.</p>
              </div>
              <div className="devis-info-card">
                <div className="devis-info-icon"><i className="fa-solid fa-file-invoice"></i></div>
                <h4>Devis détaillé</h4>
                <p>Vous recevez un devis complet et transparent, sans frais cachés.</p>
              </div>
              <div className="devis-info-card">
                <div className="devis-info-icon"><i className="fa-solid fa-handshake"></i></div>
                <h4>Sans engagement</h4>
                <p>Notre devis est entièrement gratuit et sans obligation de votre part.</p>
              </div>
              <div className="devis-contact-box">
                <p>Vous préférez nous appeler ?</p>
                <a href="tel:+21312345678"><i className="fa-solid fa-phone"></i> +213 12 345 678</a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
