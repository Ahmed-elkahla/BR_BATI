import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { dataApi } from "../api/auth";

const STATUSES = ["Nouveau", "En cours", "Traité", "Refusé"];

const STATUS_STYLE = {
  "Nouveau":  "blue",
  "En cours": "orange",
  "Traité":   "green",
  "Refusé":   "red",
};

export default function DevisAdminPage() {
  const [list, setList]       = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    dataApi.adminDevis().then(setList).catch(() => {});
  }, []);

  async function changeStatus(id, status) {
    await dataApi.updateDevisStatus(id, status);
    setList((prev) => prev.map((d) => d.id === id ? { ...d, status } : d));
    if (selected?.id === id) setSelected((s) => ({ ...s, status }));
  }

  return (
    <DashboardLayout>
      <div className="dash-section-title">Demandes de devis</div>

      <div className="dash-card">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Email</th>
              <th>Type de projet</th>
              <th>Budget</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", color: "#94a3b8", padding: 32 }}>Aucune demande pour l'instant.</td></tr>
            )}
            {list.map((d) => (
              <tr key={d.id}>
                <td><strong>{d.firstName} {d.lastName}</strong></td>
                <td className="text-muted">{d.email}</td>
                <td>{d.projectType}</td>
                <td className="text-muted">{d.budget || "—"}</td>
                <td className="text-muted">{new Date(d.createdAt).toLocaleDateString("fr-FR")}</td>
                <td>
                  <span className={`role-badge ${STATUS_STYLE[d.status] ?? "blue"}`}>{d.status}</span>
                </td>
                <td>
                  <button className="dash-link-btn" onClick={() => setSelected(d)}>Voir →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>✖</button>
            <h2 style={{ marginBottom: 4 }}>{selected.firstName} {selected.lastName}</h2>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>{selected.email} {selected.phone ? `· ${selected.phone}` : ""}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Type de projet", value: selected.projectType },
                { label: "Budget",         value: selected.budget || "—" },
                { label: "Localisation",   value: selected.location || "—" },
                { label: "Délai souhaité", value: selected.timeline || "—" },
              ].map((r) => (
                <div key={r.label} style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>{r.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a2236" }}>{r.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 14px", marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>Description</div>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{selected.description}</p>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>Changer le statut</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => changeStatus(selected.id, s)}
                    style={{
                      padding: "7px 16px", borderRadius: 20, border: "2px solid",
                      fontWeight: 600, fontSize: 13, cursor: "pointer",
                      background: selected.status === s ? "#f97316" : "#fff",
                      borderColor: selected.status === s ? "#f97316" : "#e2e8f0",
                      color: selected.status === s ? "#fff" : "#64748b",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
