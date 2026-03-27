import { useEffect, useState } from "react";
import { dataApi } from "../api/auth";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    dataApi.services().then(setServices).catch(() => {});
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-content">
          <span className="page-hero-tag">Nos Services</span>
          <h1>Des solutions complètes pour vos projets</h1>
          <p>De la conception à la livraison, nous vous accompagnons à chaque étape de votre projet de construction.</p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="page-section">
        <div className="page-container">
          <div className="section-header">
            <h2>Ce que nous proposons</h2>
            <p>Cliquez sur un service pour en savoir plus.</p>
          </div>
          <div className="services-grid-full">
            {services.map((s) => (
              <div className="service-card-full" key={s.id} onClick={() => setPopup(s)}>
                <div className="scf-icon"><i className={`fa-solid ${s.icon}`}></i></div>
                <h3>{s.label}</h3>
                <p>{s.desc}</p>
                <span className="scf-more">En savoir plus →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="page-section alt">
        <div className="page-container">
          <div className="section-header">
            <h2>Pourquoi nous choisir ?</h2>
          </div>
          <div className="why-grid">
            {[
              { icon: "fa-medal",        title: "Expertise reconnue",    desc: "Plus de 15 ans d'expérience dans le secteur de la construction." },
              { icon: "fa-clock",        title: "Respect des délais",    desc: "Nous livrons vos projets dans les temps, sans compromis sur la qualité." },
              { icon: "fa-shield-halved",title: "Qualité garantie",      desc: "Matériaux certifiés et équipes qualifiées pour chaque chantier." },
              { icon: "fa-headset",      title: "Suivi personnalisé",    desc: "Un interlocuteur dédié tout au long de votre projet." },
            ].map((w) => (
              <div className="why-card" key={w.title}>
                <div className="why-icon"><i className={`fa-solid ${w.icon}`}></i></div>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPUP */}
      {popup && (
        <div className="modal-overlay" onClick={() => setPopup(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setPopup(null)}>✖</button>
            <div style={{ fontSize: 40, color: "#f97316", marginBottom: 12 }}>
              <i className={`fa-solid ${popup.icon}`}></i>
            </div>
            <h2>{popup.label}</h2>
            <p style={{ color: "#64748b", marginTop: 12, lineHeight: 1.7 }}>{popup.desc}</p>
          </div>
        </div>
      )}
    </>
  );
}
