import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { dataApi } from "../api/auth";
import chantier1 from "../assets/images/chantier1.jpg";
import chantier2 from "../assets/images/chantier2.jpg";
import chantier3 from "../assets/images/chantier3.jpg";
import chantier4 from "../assets/images/chantier4.jpg";
import chantier5 from "../assets/images/chantier5.jpg";

const localImages = [chantier1, chantier2, chantier3, chantier4, chantier5];

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    dataApi.projects()
      .then((data) => setProjects(data.map((p, i) => ({ ...p, image: localImages[i % localImages.length] }))))
      .catch(() => {});
  }, []);

  return (
    <section className="projects">
      <h2>Nos Réalisations</h2>
      <p>Découvrez nos projets achevés qui témoignent de notre savoir-faire et de notre engagement qualité.</p>
      <div className="projects-grid">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}
