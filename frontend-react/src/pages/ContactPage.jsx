import { useState } from "react";

const EMPTY = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm]       = useState(EMPTY);
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  }

  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-content">
          <span className="page-hero-tag">Contact</span>
          <h1>Parlons de votre projet</h1>
          <p>Notre équipe est disponible pour répondre à toutes vos questions.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="page-container">
          <div className="contact-layout">

            {/* INFO */}
            <aside className="contact-info">
              <h3>Nos coordonnées</h3>
              <div className="contact-info-list">
                {[
                  { icon: "fa-location-dot", label: "Adresse",   value: "12 Rue de la Construction, Tunis 1002, Tunisie" },
                  { icon: "fa-phone",        label: "Téléphone", value: "+213 12 345 678" },
                  { icon: "fa-envelope",     label: "Email",     value: "contact@batipro.com" },
                  { icon: "fa-clock",        label: "Horaires",  value: "Lun – Ven : 8h00 – 18h00" },
                ].map((c) => (
                  <div className="contact-info-item" key={c.label}>
                    <div className="contact-info-icon"><i className={`fa-solid ${c.icon}`}></i></div>
                    <div>
                      <span className="contact-info-label">{c.label}</span>
                      <p>{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* MAP placeholder */}
              <div className="contact-map">
                <iframe
                  title="map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102087.27083864!2d10.0719!3d36.8065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd337f5e7ef543%3A0xd671924e714a0275!2sTunis!5e0!3m2!1sfr!2stn!4v1700000000000"
                  width="100%" height="200" style={{ border: 0, borderRadius: 10 }}
                  allowFullScreen loading="lazy"
                />
              </div>
            </aside>

            {/* FORM */}
            <div className="contact-form-wrap">
              {sent ? (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                  <h3 style={{ color: "#1a2236", marginBottom: 10 }}>Message envoyé !</h3>
                  <p style={{ color: "#64748b", marginBottom: 24 }}>Nous vous répondrons dans les plus brefs délais.</p>
                  <button className="btn-orange" onClick={() => { setForm(EMPTY); setSent(false); }}>
                    Nouveau message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <h3>Envoyez-nous un message</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nom complet *</label>
                      <input value={form.name} onChange={(e) => set("name", e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Sujet *</label>
                    <input value={form.subject} onChange={(e) => set("subject", e.target.value)} required placeholder="Ex: Demande d'information, Partenariat…" />
                  </div>
                  <div className="form-group">
                    <label>Message *</label>
                    <textarea value={form.message} onChange={(e) => set("message", e.target.value)} required rows={6} placeholder="Votre message…" />
                  </div>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? "Envoi…" : "Envoyer le message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
