import { useEffect, useState } from "react";
import { dataApi } from "../api/auth";
import ProjectCard from "../components/ProjectCard";
import chantier1 from "../assets/images/chantier1.jpg";
import chantier2 from "../assets/images/chantier2.jpg";
import chantier3 from "../assets/images/chantier3.jpg";
import chantier4 from "../assets/images/chantier4.jpg";
import chantier5 from "../assets/images/chantier5.jpg";

const localImages = [chantier1, chantier2, chantier3, chantier4, chantier5];
const ALL = "Tous";

export default function RealisationsPage() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter]     = useState(ALL);

  useEffect(() => {
    dataApi.projects()
      .then((data) => setProjects(data.map((p, i) => ({ ...p, image: localImages[i % localImages.length] }))))
      .catch(() => {});
    window.scrollTo(0, 0);
  }, []);

  const types = [ALL, ...Array.from(new Set(projects.map((p) => p.type).filter(Boolean)))];
  const filtered = filter === ALL ? projects : projects.filter((p) => p.type === filter);

  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-content">
          <span className="page-hero-tag">Nos Réalisations</span>
          <h1>Des projets qui parlent d'eux-mêmes</h1>
          <p>Découvrez notre portfolio de réalisations à travers la Tunisie et au-delà.</p>
        </div>
      </section>

      {/* FILTER + GRID */}
      <section className="page-section">
        <div className="page-container">
          <div className="filter-bar">
            {types.map((t) => (
              <button
                key={t}
                className={`filter-btn ${filter === t ? "active" : ""}`}
                onClick={() => setFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p style={{ textAlign: "center", color: "#94a3b8", padding: "60px 0" }}>Aucun projet trouvé.</p>
          ) : (
            <div className="projects-grid" style={{ marginTop: 32 }}>
              {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
