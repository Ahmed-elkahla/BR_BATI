import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { dataApi } from "../api/auth";

const EMPTY_FORM = { firstName: "", lastName: "", email: "", phone: "", password: "" };
const EMPTY_EDIT = { id: "", firstName: "", lastName: "", phone: "", isActive: true };

export default function UsersPage() {
  const [users, setUsers]         = useState([]);
  const [showAdd, setShowAdd]     = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editData, setEditData]   = useState(null);   // null = closed
  const [deleteId, setDeleteId]   = useState(null);   // null = closed
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  function load() {
    dataApi.adminUsers().then(setUsers).catch(() => {});
  }

  useEffect(() => { load(); }, []);

  // ── Register ──────────────────────────────────────────────────────────────
  async function handleCreate(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await dataApi.createUser(form);
      setShowAdd(false); setForm(EMPTY_FORM); load();
    } catch (err) {
      setError(err.message ?? "Erreur");
    } finally { setLoading(false); }
  }

  // ── Edit ──────────────────────────────────────────────────────────────────
  async function handleEdit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await dataApi.updateUser(editData.id, {
        firstName: editData.firstName,
        lastName:  editData.lastName,
        phone:     editData.phone,
        isActive:  editData.isActive,
      });
      setEditData(null); load();
    } catch (err) {
      setError(err.message ?? "Erreur");
    } finally { setLoading(false); }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete() {
    setLoading(true);
    try {
      await dataApi.deleteUser(deleteId);
      setDeleteId(null); load();
    } catch (err) {
      setError(err.message ?? "Erreur");
    } finally { setLoading(false); }
  }

  return (
    <DashboardLayout>
      <div className="dash-card">
        <div className="dash-card-header">
          <h4>Gestion des utilisateurs ({users.length})</h4>
          <button className="btn-orange-sm" onClick={() => { setShowAdd(true); setError(""); }}>
            <i className="fa-solid fa-user-plus" style={{ marginRight: 6 }}></i>
            Nouveau client
          </button>
        </div>

        <table className="dash-table">
          <thead>
            <tr>
              <th>Nom</th><th>Email</th><th>Téléphone</th><th>Rôle</th>
              <th>Statut</th><th>Inscrit le</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td><strong>{u.name}</strong></td>
                <td className="text-muted">{u.email}</td>
                <td className="text-muted">{u.phone || "—"}</td>
                <td>
                  <span className={`role-badge ${u.role === "ADMIN" ? "admin" : "client"}`}>{u.role}</span>
                </td>
                <td>
                  <span className={`status-dot ${u.isActive ? "active" : "inactive"}`}>
                    {u.isActive ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="text-muted">{u.joined}</td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="dash-link-btn"
                      title="Modifier"
                      onClick={() => { setEditData({ id: u.id, firstName: u.firstName, lastName: u.lastName, phone: u.phone, isActive: u.isActive }); setError(""); }}
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    {u.role !== "ADMIN" && (
                      <button
                        className="dash-link-btn"
                        title="Supprimer"
                        style={{ color: "#ef4444" }}
                        onClick={() => setDeleteId(u.id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Register Modal ── */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAdd(false)}>✖</button>
            <h2>Créer un client</h2>
            <p className="modal-sub">Le client pourra se connecter avec ces identifiants.</p>
            <form onSubmit={handleCreate}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label>Prénom</label>
                  <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                </div>
                <div>
                  <label>Nom</label>
                  <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                </div>
              </div>
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <label>Téléphone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+213..." />
              <label>Mot de passe</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Création…" : "Créer le compte"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editData && (
        <div className="modal-overlay" onClick={() => setEditData(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditData(null)}>✖</button>
            <h2>Modifier l'utilisateur</h2>
            <p className="modal-sub"> </p>
            <form onSubmit={handleEdit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label>Prénom</label>
                  <input value={editData.firstName} onChange={(e) => setEditData({ ...editData, firstName: e.target.value })} required />
                </div>
                <div>
                  <label>Nom</label>
                  <input value={editData.lastName} onChange={(e) => setEditData({ ...editData, lastName: e.target.value })} required />
                </div>
              </div>
              <label>Téléphone</label>
              <input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <input
                  type="checkbox"
                  checked={editData.isActive}
                  onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                  style={{ width: "auto" }}
                />
                Compte actif
              </label>
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Enregistrement…" : "Enregistrer"}
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
            <p style={{ color: "#64748b", marginBottom: 20 }}>
              Cette action est irréversible. Tous les projets liés seront également supprimés.
            </p>
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
