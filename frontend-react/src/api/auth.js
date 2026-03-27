const BASE = "http://localhost:4000/api";

let _accessToken = null;

export function setToken(t) { _accessToken = t; }
export function getToken()  { return _accessToken; }
export function clearToken(){ _accessToken = null; }

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers ?? {}) };
  if (_accessToken) headers["Authorization"] = `Bearer ${_accessToken}`;

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { ...options, headers, credentials: "include" });
  } catch {
    throw { status: 0, message: "Impossible de contacter le serveur. Vérifiez que le backend est démarré." };
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, message: data.message ?? "Erreur serveur" };
  return data;
}

export const authApi = {
  login:   (email, password) => request("/auth/login",  { method: "POST", body: JSON.stringify({ email, password }) }),
  me:      ()                => request("/auth/me"),
  logout:  ()                => request("/auth/logout", { method: "POST" }),
};

export const dataApi = {
  projects:        () => request("/projects"),
  stats:           () => request("/stats"),
  services:        () => request("/services"),
  register:        (body) => request("/register", { method: "POST", body: JSON.stringify(body) }),
  adminKpis:       () => request("/admin/kpis"),
  adminUsers:      () => request("/admin/users"),
  createUser:      (body) => request("/admin/users", { method: "POST", body: JSON.stringify(body) }),
  updateUser:      (id, body) => request(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteUser:      (id) => request(`/admin/users/${id}`, { method: "DELETE" }),
  adminProjects:   () => request("/admin/projects"),
  createProject:   (body) => request("/admin/projects", { method: "POST", body: JSON.stringify(body) }),
  updateProject:   (id, body) => request(`/admin/projects/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteProject:   (id) => request(`/admin/projects/${id}`, { method: "DELETE" }),
  clientProjects:  () => request("/client/projects"),
  clientDocuments: () => request("/client/documents"),
  submitDevis:     (body) => request("/devis", { method: "POST", body: JSON.stringify(body) }),
  adminDevis:      () => request("/admin/devis"),
  updateDevisStatus: (id, status) => request(`/admin/devis/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
};
