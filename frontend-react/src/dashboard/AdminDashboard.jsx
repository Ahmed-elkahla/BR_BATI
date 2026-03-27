import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import { dataApi } from "../api/auth";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [kpis, setKpis]         = useState([]);
  const [users, setUsers]       = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    dataApi.adminKpis().then(setKpis).catch(() => {});
    dataApi.adminUsers().then(setUsers).catch(() => {});
    dataApi.adminProjects().then(setProjects).catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <div className="dash-section-title">Vue d'ensemble</div>

      {/* KPI CARDS */}
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className={`kpi-card kpi-${k.color}`} key={k.label}>
            <div className="kpi-icon"><i className={`fa-solid ${k.icon}`}></i></div>
            <div className="kpi-body">
              <p className="kpi-label">{k.label}</p>
              <h2 className="kpi-value">{k.value}</h2>
              <span className="kpi-delta">{k.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-row">
        {/* PROJECTS PROGRESS */}
        <div className="dash-card dash-card-lg">
          <div className="dash-card-header">
            <h4>Avancement des projets</h4>
            <button className="dash-link-btn">Voir tout →</button>
          </div>
          <div className="project-list">
            {projects.map((p) => (
              <div className="project-row" key={p.name}>
                <div className="project-row-info">
                  <span className="project-row-name">{p.name}</span>
                  <span className={`status-badge ${p.status === "Finition" ? "green" : p.status === "Démarrage" ? "blue" : "orange"}`}>
                    {p.status}
                  </span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar" style={{ width: `${p.progress}%` }}></div>
                </div>
                <div className="project-row-foot">
                  <span>{p.progress}%</span>
                  <span>{p.budget}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* placeholder for activity feed — requires Activity model */}
        <div className="dash-card dash-card-sm">
          <div className="dash-card-header"><h4>Activité récente</h4></div>
          <ul className="activity-list"></ul>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="dash-card">
        <div className="dash-card-header">
          <h4>Utilisateurs récents</h4>
          <button className="dash-link-btn" onClick={() => navigate("/dashboard/admin/users")}>Gérer les utilisateurs →</button>
        </div>
        <table className="dash-table">
          <thead>
            <tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Inscrit le</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email}>
                <td><strong>{u.name}</strong></td>
                <td className="text-muted">{u.email}</td>
                <td>
                  <span className={`role-badge ${u.role === "ADMIN" ? "admin" : "client"}`}>{u.role}</span>
                </td>
                <td>
                  <span className={`status-dot ${u.status === "Actif" ? "active" : "inactive"}`}>{u.status}</span>
                </td>
                <td className="text-muted">{u.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
