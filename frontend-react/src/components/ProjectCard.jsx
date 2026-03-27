export default function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <img src={project.image} alt={project.name} />
      <div className="tags">
        <span className="tag orange">{project.type}</span>
        <span className="tag gray">{project.year}</span>
      </div>
      <h3>{project.name}</h3>
      <p className="location">📍 {project.location}</p>
      <p>{project.description}</p>
    </div>
  );
}
