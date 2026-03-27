import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "./DashboardLayout";
import { dataApi } from "../api/auth";

const fileIcon  = { PDF: "fa-file-pdf", DWG: "fa-file-code", XLSX: "fa-file-excel" };
const fileColor = { PDF: "red", DWG: "blue", XLSX: "green" };

export default function ClientDashboard() {
  const { user } = useAuth();
  const [projects,  setProjects]  = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    dataApi.clientProjects().then(setProjects).catch(() => {});
    dataApi.clientDocuments().then(setDocuments).catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      {/* WELCOME BANNER */}
      <div className="client-welcome">
        <div>
          <h2>Bonjour, {user?.firstName} 👋</h2>
          <p>Voici l'état de vos projets en cours.</p>
        </div>
        <button className="btn-orange-sm">+ Demander un devis</button>
      </div>

      {/* PROJECT CARDS */}
      <div className="client-projects-grid">
        {projects.map((p) => (
          <div className="client-project-card" key={p.id}>
            <div className="cpcard-header">
              <h4>{p.name}</h4>
              <span className={`status-badge ${p.status === "En cours" ? "orange" : "blue"}`}>{p.status}</span>
            </div>
            <p className="cpcard-phase">Phase : <strong>{p.phase}</strong></p>
            <div className="progress-bar-wrap">
              <div className="progress-bar" style={{ width: `${p.progress}%` }}></div>
            </div>
            <p className="cpcard-pct">{p.progress}% complété</p>
            <div className="cpcard-meta">
              <span>📅 {p.startDate} → {p.endDate}</span>
            </div>
            <div className="cpcard-budget">
              <div><span className="meta-label">Budget total</span><strong>{p.budget}</strong></div>
              <div><span className="meta-label">Dépensé</span><strong>{p.spent}</strong></div>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-row">
        {/* TIMELINE — requires Timeline model */}
        <div className="dash-card dash-card-sm">
          <div className="dash-card-header"><h4>Calendrier du projet</h4></div>
          <ul className="timeline"></ul>
        </div>

        {/* DOCUMENTS */}
        <div className="dash-card dash-card-lg">
          <div className="dash-card-header">
            <h4>Mes documents</h4>
            <button className="dash-link-btn">Voir tout →</button>
          </div>
          <table className="dash-table">
            <thead>
              <tr><th>Fichier</th><th>Type</th><th>Date</th><th>Taille</th><th></th></tr>
            </thead>
            <tbody>
              {documents.map((d) => (
                <tr key={d.name}>
                  <td>
                    <i className={`fa-solid ${fileIcon[d.type] ?? "fa-file"} file-icon ${fileColor[d.type]}`}></i>
                    {" "}{d.name}
                  </td>
                  <td><span className={`role-badge ${fileColor[d.type]}`}>{d.type}</span></td>
                  <td className="text-muted">{d.date}</td>
                  <td className="text-muted">{d.size}</td>
                  <td><button className="dash-link-btn"><i className="fa-solid fa-download"></i></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
