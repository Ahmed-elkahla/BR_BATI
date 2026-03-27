import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import db from "../db";

// ── Public ────────────────────────────────────────────────────────────────────

export async function getProjects(_req: AuthRequest, res: Response) {
  const projects = await db.project.findMany({
    where: { clientId: null },
    select: { id: true, name: true, description: true, location: true, type: true, year: true, status: true, progress: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json(projects);
}

export async function getStats(_req: AuthRequest, res: Response) {
  const stats = await db.stat.findMany({ orderBy: { order: "asc" } });
  return res.json(stats);
}

export async function getServices(_req: AuthRequest, res: Response) {
  const services = await db.service.findMany({ orderBy: { order: "asc" } });
  return res.json(services);
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function getAdminKpis(_req: AuthRequest, res: Response) {
  const [activeProjects, clients, revenue, alerts] = await Promise.all([
    db.project.count({ where: { status: { not: "Terminé" } } }),
    db.user.count({ where: { role: "CLIENT" } }),
    db.project.aggregate({ _sum: { budget: true } }),
    db.project.count({ where: { status: "Retard" } }),
  ]);
  return res.json([
    { icon: "fa-folder-open",            label: "Projets actifs", value: String(activeProjects), delta: "actifs",   color: "orange" },
    { icon: "fa-users",                  label: "Clients",        value: String(clients),        delta: "inscrits", color: "blue"   },
    { icon: "fa-euro-sign",              label: "CA en cours",    value: `${((revenue._sum.budget ?? 0) / 1_000_000).toFixed(1)}M€`, delta: "budget total", color: "green" },
    { icon: "fa-triangle-exclamation",   label: "Alertes",        value: String(alerts),         delta: "à traiter", color: "red"   },
  ]);
}

export async function getAdminUsers(_req: AuthRequest, res: Response) {
  const users = await db.user.findMany({
    select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true, isActive: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json(users.map((u) => ({
    id:     u.id,
    name:   `${u.firstName} ${u.lastName}`,
    firstName: u.firstName,
    lastName:  u.lastName,
    email:  u.email,
    phone:  u.phone ?? "",
    role:   u.role,
    status: u.isActive ? "Actif" : "Inactif",
    isActive: u.isActive,
    joined: new Date(u.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
  })));
}

export async function registerClient(req: AuthRequest, res: Response) {
  const { firstName, lastName, email, phone, password } = req.body;
  if (!firstName || !lastName || !email || !password)
    return res.status(400).json({ message: "Champs obligatoires manquants" });
  try {
    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { firstName, lastName, email, phone: phone || null, passwordHash, role: "CLIENT" },
      select: { id: true, firstName: true, lastName: true, email: true, role: true },
    });
    return res.status(201).json({ user });
  } catch (e: any) {
    if (e.code === "P2002") return res.status(409).json({ message: "Email ou téléphone déjà utilisé" });
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function updateUser(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { firstName, lastName, phone, isActive } = req.body;
  try {
    const user = await db.user.update({
      where: { id },
      data: { firstName, lastName, phone: phone || null, isActive },
      select: { id: true, firstName: true, lastName: true, email: true, role: true, isActive: true },
    });
    return res.json({ user });
  } catch {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }
}

export async function deleteUser(req: AuthRequest, res: Response) {
  const { id } = req.params;
  if (req.user!.sub === id)
    return res.status(400).json({ message: "Vous ne pouvez pas supprimer votre propre compte" });
  try {
    await db.user.delete({ where: { id } });
    return res.json({ message: "Utilisateur supprimé" });
  } catch {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }
}

export async function getAdminProjects(_req: AuthRequest, res: Response) {
  const projects = await db.project.findMany({
    select: {
      id: true, name: true, description: true, status: true, phase: true,
      progress: true, budget: true, spent: true, location: true, type: true, year: true,
      startDate: true, endDate: true, clientId: true,
      client: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return res.json(projects.map((p) => ({
    ...p,
    startDate: p.startDate.toISOString().split("T")[0],
    endDate:   p.endDate.toISOString().split("T")[0],
  })));
}

export async function createProject(req: AuthRequest, res: Response) {
  const { name, description, status, phase, progress, budget, spent, location, type, year, startDate, endDate, clientId } = req.body;
  if (!name || !startDate || !endDate)
    return res.status(400).json({ message: "Champs obligatoires manquants" });
  try {
    const project = await db.project.create({
      data: {
        name, description, status, phase, location, type, year,
        progress: Number(progress) || 0,
        budget:   Number(budget)   || 0,
        spent:    Number(spent)    || 0,
        startDate: new Date(startDate),
        endDate:   new Date(endDate),
        clientId:  clientId || null,
      },
    });
    return res.status(201).json({ project });
  } catch (e: any) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function updateProject(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { name, description, status, phase, progress, budget, spent, location, type, year, startDate, endDate, clientId } = req.body;
  try {
    const project = await db.project.update({
      where: { id },
      data: {
        name, description, status, phase, location, type, year,
        progress: Number(progress),
        budget:   Number(budget),
        spent:    Number(spent),
        startDate: new Date(startDate),
        endDate:   new Date(endDate),
        clientId:  clientId || null,
      },
    });
    return res.json({ project });
  } catch {
    return res.status(404).json({ message: "Projet introuvable" });
  }
}

export async function deleteProject(req: AuthRequest, res: Response) {
  const { id } = req.params;
  try {
    await db.project.delete({ where: { id } });
    return res.json({ message: "Projet supprimé" });
  } catch {
    return res.status(404).json({ message: "Projet introuvable" });
  }
}

// ── Client ────────────────────────────────────────────────────────────────────

export async function getClientProjects(req: AuthRequest, res: Response) {
  const projects = await db.project.findMany({
    where: { clientId: req.user!.sub },
    select: { id: true, name: true, status: true, progress: true, phase: true, startDate: true, endDate: true, budget: true, spent: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json(projects.map((p) => ({
    ...p,
    startDate: new Date(p.startDate).toLocaleDateString("fr-FR", { month: "short", year: "numeric" }),
    endDate:   new Date(p.endDate).toLocaleDateString("fr-FR",   { month: "short", year: "numeric" }),
    budget:    `${p.budget.toLocaleString("fr-FR")} €`,
    spent:     `${p.spent.toLocaleString("fr-FR")} €`,
  })));
}

export async function getClientDocuments(req: AuthRequest, res: Response) {
  // Documents are not yet in the schema — return empty until model is added
  return res.json([]);
}
