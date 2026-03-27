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

      {/* 3D COMPANY SHOWCASE */}
      <section className="page-section">
        <div className="page-container">
          <div className="section-header">
            <h2>Notre Société en 3D</h2>
            <p>Découvrez BâtiPro sous un nouvel angle — architecture, innovation et excellence.</p>
          </div>
          <div className="company-3d-wrap">
            <div className="company-3d-scene">
              <div className="company-3d-card">
                {/* FRONT */}
                <div className="c3d-face c3d-front">
                  <div className="c3d-logo">🏗️</div>
                  <h2>BâtiPro</h2>
                  <p>Architecture & Construction</p>
                  <div className="c3d-divider" />
                  <div className="c3d-stats">
                    <div className="c3d-stat"><span>15+</span><small>Ans d'expérience</small></div>
                    <div className="c3d-stat"><span>200+</span><small>Projets livrés</small></div>
                    <div className="c3d-stat"><span>98%</span><small>Satisfaction client</small></div>
                  </div>
                </div>
                {/* BACK */}
                <div className="c3d-face c3d-back">
                  <div className="c3d-logo">🏆</div>
                  <h2>Notre Mission</h2>
                  <p style={{ fontSize: 13, color: "#a0aec0", lineHeight: 1.7, margin: "12px 0" }}>
                    Construire des espaces qui inspirent, durer dans le temps et respecter l'environnement. Chaque projet est une œuvre d'art fonctionnelle.
                  </p>
                  <div className="c3d-tags">
                    <span>Innovation</span>
                    <span>Durabilité</span>
                    <span>Excellence</span>
                    <span>Précision</span>
                  </div>
                </div>
              </div>
            </div>
            {/* SIDE INFO */}
            <div className="company-3d-info">
              <div className="c3d-info-item">
                <div className="c3d-info-icon"><i className="fa-solid fa-building"></i></div>
                <div>
                  <h4>Fondée en 2009</h4>
                  <p>Plus de 15 ans au service de vos projets de construction et d'architecture.</p>
                </div>
              </div>
              <div className="c3d-info-item">
                <div className="c3d-info-icon"><i className="fa-solid fa-users"></i></div>
                <div>
                  <h4>Équipe d'experts</h4>
                  <p>50+ professionnels qualifiés : architectes, ingénieurs, chefs de chantier.</p>
                </div>
              </div>
              <div className="c3d-info-item">
                <div className="c3d-info-icon"><i className="fa-solid fa-globe"></i></div>
                <div>
                  <h4>Présence nationale</h4>
                  <p>Interventions dans toutes les wilayas avec des équipes locales dédiées.</p>
                </div>
              </div>
              <div className="c3d-info-item">
                <div className="c3d-info-icon"><i className="fa-solid fa-leaf"></i></div>
                <div>
                  <h4>Éco-responsable</h4>
                  <p>Matériaux certifiés et techniques de construction respectueuses de l'environnement.</p>
                </div>
              </div>
            </div>
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
