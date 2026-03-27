import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const adminLinks = [
  { to: "/dashboard/admin",          icon: "fa-gauge",        label: "Vue d'ensemble" },
  { to: "/dashboard/admin/users",    icon: "fa-users",        label: "Utilisateurs" },
  { to: "/dashboard/admin/projects", icon: "fa-diagram-project", label: "Projets" },
  { to: "/dashboard/admin/devis",    icon: "fa-file-invoice",  label: "Devis" },
  { to: "/dashboard/admin/reports",  icon: "fa-chart-bar",    label: "Rapports" },
  { to: "/dashboard/admin/settings", icon: "fa-gear",         label: "Paramètres" },
];

const clientLinks = [
  { to: "/dashboard/client",             icon: "fa-gauge",        label: "Mon espace" },
  { to: "/dashboard/client/projects",    icon: "fa-hard-hat",     label: "Mes projets" },

];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const links = user?.role === "ADMIN" ? adminLinks : clientLinks;

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className={`dash-root ${collapsed ? "collapsed" : ""}`}>
      {/* SIDEBAR */}
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <span className="dash-logo-icon">🏗️</span>
          {!collapsed && <span className="dash-logo-text">BâtiPro</span>}
        </div>

        <nav className="dash-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to.split("/").length === 3}
              className={({ isActive }) => `dash-link ${isActive ? "active" : ""}`}
            >
              <i className={`fa-solid ${l.icon}`}></i>
              {!collapsed && <span>{l.label}</span>}
            </NavLink>
          ))}
        </nav>

        <button className="dash-collapse" onClick={() => setCollapsed(!collapsed)}>
          <i className={`fa-solid ${collapsed ? "fa-chevron-right" : "fa-chevron-left"}`}></i>
        </button>
      </aside>

      {/* MAIN */}
      <div className="dash-main">
        {/* TOPBAR */}
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <h3 className="dash-page-title">
              {user?.role === "ADMIN" ? "Administration" : "Espace Client"}
            </h3>
          </div>
          <div className="dash-topbar-right">
            <div className="dash-user-pill">
              <div className="dash-avatar">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="dash-user-meta">
                <span className="dash-user-name">{user?.firstName} {user?.lastName}</span>
                <span className={`dash-role-badge ${user?.role === "ADMIN" ? "admin" : "client"}`}>
                  {user?.role}
                </span>
              </div>
            </div>
            <button className="dash-logout-btn" onClick={handleLogout} title="Déconnexion">
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="dash-content">{children}</main>
      </div>
    </div>
  );
}
