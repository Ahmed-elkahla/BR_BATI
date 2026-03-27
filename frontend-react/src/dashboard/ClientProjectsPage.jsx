import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { dataApi } from "../api/auth";

const PHASES = ["Études", "Démarrage", "Gros œuvre", "Second œuvre", "Finitions", "Livraison"];

const STATUS_COLOR = {
  "En cours":      "orange",
  "Planification": "blue",
  "Finition":      "green",
  "Terminé":       "green",
  "Retard":        "red",
};

function fmt(n) {
  return Number(n).toLocaleString("fr-FR") + " €";
}

function PhaseTimeline({ currentPhase }) {
  const current = PHASES.indexOf(currentPhase);
  return (
    <ul className="timeline" style={{ marginTop: 8 }}>
      {PHASES.map((phase, i) => {
        const done    = i < current;
        const active  = i === current;
        return (
          <li key={phase} className={`timeline-item ${done || active ? "done" : ""}`}>
            <div className="timeline-dot">
              {done
                ? <i className="fa-solid fa-circle-check"></i>
                : active
                  ? <i className="fa-solid fa-circle-dot" style={{ color: "#f97316" }}></i>
                  : <i className="fa-regular fa-circle"></i>}
            </div>
            <div className="timeline-body">
              <p style={{ fontWeight: active ? 700 : 500, color: active ? "#f97316" : undefined }}>{phase}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function ClientProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    dataApi.clientProjects()
      .then((data) => { setProjects(data); if (data.length) setSelected(data[0].id); })
      .catch(() => {});
  }, []);

  const project = projects.find((p) => p.id === selected) ?? null;
  const spentPct = project ? Math.min(100, Math.round((project.spent / project.budget) * 100)) : 0;

  return (
    <DashboardLayout>
      <div className="dash-section-title">Mes projets</div>

      {projects.length === 0 ? (
        <div className="dash-card" style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
          <i className="fa-solid fa-folder-open" style={{ fontSize: 40, marginBottom: 16 }}></i>
          <p>Aucun projet pour le moment.</p>
        </div>
      ) : (
        <>
          {/* ── Project selector tabs ── */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                style={{
                  padding: "8px 18px", borderRadius: 20, border: "2px solid",
                  borderColor: selected === p.id ? "#f97316" : "#e2e8f0",
                  background:  selected === p.id ? "#fff7ed" : "#fff",
                  color:       selected === p.id ? "#f97316" : "#64748b",
                  fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}
              >
                {p.name}
              </button>
            ))}
          </div>

          {project && (
            <>
              {/* ── Header card ── */}
              <div className="client-welcome">
                <div>
                  <h2 style={{ fontSize: 20 }}>{project.name}</h2>
                  {project.description && <p style={{ marginTop: 4 }}>{project.description}</p>}
                  {project.location && <p style={{ marginTop: 2, fontSize: 13 }}>📍 {project.location}</p>}
                </div>
                <span className={`status-badge ${STATUS_COLOR[project.status] ?? "orange"}`} style={{ fontSize: 13, padding: "6px 16px" }}>
                  {project.status}
                </span>
              </div>

              <div className="dash-row">
                {/* ── Left column ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                  {/* Progress */}
                  <div className="dash-card">
                    <div className="dash-card-header"><h4>Avancement global</h4></div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                      <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                        <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)", width: 80, height: 80 }}>
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f97316" strokeWidth="3"
                            strokeDasharray={`${project.progress} ${100 - project.progress}`}
                            strokeLinecap="round" />
                        </svg>
                        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#1a2236" }}>
                          {project.progress}%
                        </span>
                      </div>
                      <div>
                        <p style={{ fontSize: 13, color: "#64748b" }}>Phase actuelle</p>
                        <p style={{ fontWeight: 700, fontSize: 16, color: "#1a2236" }}>{project.phase}</p>
                        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                          📅 {project.startDateFmt} → {project.endDateFmt}
                        </p>
                      </div>
                    </div>
                    <div className="progress-bar-wrap" style={{ height: 10 }}>
                      <div className="progress-bar" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="dash-card">
                    <div className="dash-card-header"><h4>Budget</h4></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                      <div style={budgetBox}>
                        <span style={budgetLabel}>Budget total</span>
                        <strong style={budgetValue}>{fmt(project.budget)}</strong>
                      </div>
                      <div style={budgetBox}>
                        <span style={budgetLabel}>Dépensé</span>
                        <strong style={{ ...budgetValue, color: "#f97316" }}>{fmt(project.spent)}</strong>
                      </div>
                      <div style={budgetBox}>
                        <span style={budgetLabel}>Restant</span>
                        <strong style={{ ...budgetValue, color: "#22c55e" }}>{fmt(project.budget - project.spent)}</strong>
                      </div>
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>
                        <span>Consommation du budget</span>
                        <span>{spentPct}%</span>
                      </div>
                      <div className="progress-bar-wrap" style={{ height: 10 }}>
                        <div className="progress-bar" style={{ width: `${spentPct}%`, background: spentPct > 90 ? "linear-gradient(90deg,#ef4444,#f87171)" : undefined }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Right column: timeline ── */}
                <div className="dash-card">
                  <div className="dash-card-header"><h4>Phases du projet</h4></div>
                  <PhaseTimeline currentPhase={project.phase} />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

const budgetBox   = { background: "#f8fafc", borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 4 };
const budgetLabel = { fontSize: 11, color: "#94a3b8" };
const budgetValue = { fontSize: 15, color: "#1a2236" };
