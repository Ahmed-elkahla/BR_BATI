import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { dataApi } from "../api/auth";

const STATUS_OPTIONS = ["Planification", "En cours", "Finition", "Terminé", "Retard"];
const PHASE_OPTIONS  = ["Études", "Démarrage", "Gros œuvre", "Second œuvre", "Finitions", "Livraison"];

const EMPTY = {
  name: "", description: "", status: "Planification", phase: "Études",
  progress: 0, budget: 0, spent: 0,
  location: "", type: "", year: new Date().getFullYear().toString(),
  startDate: "", endDate: "", clientId: "",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [clients,  setClients]  = useState([]);
  const [form,     setForm]     = useState(null);   // null=closed, EMPTY=new, obj=edit
  const [deleteId, setDeleteId] = useState(null);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  function load() {
    dataApi.adminProjects().then(setProjects).catch(() => {});
    dataApi.adminUsers().then((u) => setClients(u.filter((x) => x.role === "CLIENT"))).catch(() => {});
  }

  useEffect(() => { load(); }, []);

  const isEdit = form && form.id;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (isEdit) await dataApi.updateProject(form.id, form);
      else        await dataApi.createProject(form);
      setForm(null); load();
    } catch (err) {
      setError(err.message ?? "Erreur");
    } finally { setLoading(false); }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await dataApi.deleteProject(deleteId);
      setDeleteId(null); load();
    } catch (err) {
      setError(err.message ?? "Erreur");
    } finally { setLoading(false); }
  }

  function openEdit(p) {
    setForm({ ...p, clientId: p.clientId ?? "" });
    setError("");
  }

  const statusColor = { "En cours": "orange", "Finition": "green", "Planification": "blue", "Terminé": "green", "Retard": "red" };

  return (
    <DashboardLayout>
      <div className="dash-card">
        <div className="dash-card-header">
          <h4>Gestion des projets ({projects.length})</h4>
          <button className="btn-orange-sm" onClick={() => { setForm({ ...EMPTY }); setError(""); }}>
            <i className="fa-solid fa-plus" style={{ marginRight: 6 }}></i>
            Nouveau projet
          </button>
        </div>

        <table className="dash-table">
          <thead>
            <tr>
              <th>Nom</th><th>Client</th><th>Statut</th><th>Phase</th>
              <th>Avancement</th><th>Budget</th><th>Dates</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong>{p.name}</strong>
                  {p.location && <div className="text-muted" style={{ fontSize: 11 }}>📍 {p.location}</div>}
                </td>
                <td className="text-muted">
                  {p.client ? `${p.client.firstName} ${p.client.lastName}` : <span style={{ color: "#cbd5e1" }}>—</span>}
                </td>
                <td>
                  <span className={`status-badge ${statusColor[p.status] ?? "orange"}`}>{p.status}</span>
                </td>
                <td className="text-muted">{p.phase}</td>
                <td style={{ minWidth: 120 }}>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar" style={{ width: `${p.progress}%` }}></div>
                  </div>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{p.progress}%</span>
                </td>
                <td className="text-muted">{(p.budget / 1000).toFixed(0)}K€</td>
                <td className="text-muted" style={{ fontSize: 11 }}>
                  {p.startDate} →<br />{p.endDate}
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="dash-link-btn" title="Modifier" onClick={() => openEdit(p)}>
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button className="dash-link-btn" title="Supprimer" style={{ color: "#ef4444" }}
                      onClick={() => { setDeleteId(p.id); setError(""); }}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Create / Edit Modal ── */}
      {form && (
        <div className="modal-overlay" onClick={() => setForm(null)}>
          <div className="modal-box" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setForm(null)}>✖</button>
            <h2>{isEdit ? "Modifier le projet" : "Nouveau projet"}</h2>
            <p className="modal-sub"> </p>
            <form onSubmit={handleSubmit}>

              <label>Nom du projet</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />

              <label>Description</label>
              <input value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label>Statut</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={selectStyle}>
                    {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label>Phase</label>
                  <select value={form.phase} onChange={(e) => setForm({ ...form, phase: e.target.value })} style={selectStyle}>
                    {PHASE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div>
                  <label>Avancement (%)</label>
                  <input type="number" min={0} max={100} value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} />
                </div>
                <div>
                  <label>Budget (€)</label>
                  <input type="number" min={0} value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
                </div>
                <div>
                  <label>Dépensé (€)</label>
                  <input type="number" min={0} value={form.spent} onChange={(e) => setForm({ ...form, spent: e.target.value })} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div>
                  <label>Localisation</label>
                  <input value={form.location ?? ""} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div>
                  <label>Type</label>
                  <input value={form.type ?? ""} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Commercial…" />
                </div>
                <div>
                  <label>Année</label>
                  <input value={form.year ?? ""} onChange={(e) => setForm({ ...form, year: e.target.value })} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label>Date début</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                </div>
                <div>
                  <label>Date fin</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
                </div>
              </div>

              <label>Client (optionnel)</label>
              <select value={form.clientId ?? ""} onChange={(e) => setForm({ ...form, clientId: e.target.value })} style={selectStyle}>
                <option value="">— Aucun (projet vitrine) —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                ))}
              </select>

              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Enregistrement…" : isEdit ? "Enregistrer" : "Créer le projet"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" style={{ maxWidth: 360 }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: 10 }}>Confirmer la suppression</h2>
            <p style={{ color: "#64748b", marginBottom: 20 }}>Cette action est irréversible.</p>
            {error && <p className="form-error">{error}</p>}
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-submit" style={{ background: "#ef4444" }} onClick={handleDelete} disabled={loading}>
                {loading ? "Suppression…" : "Supprimer"}
              </button>
              <button className="btn-submit" style={{ background: "#e2e8f0", color: "#374151" }} onClick={() => setDeleteId(null)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

const selectStyle = {
  padding: "11px 14px", border: "1.5px solid #ddd", borderRadius: 8,
  fontSize: 14, outline: "none", width: "100%", background: "#fff",
};
