import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("Password123!", 10);

  // ── Users ──────────────────────────────────────────────────────────────────
  await prisma.user.upsert({
    where: { email: "admin@ar-bati.com" },
    update: {},
    create: { email: "admin@ar-bati.com", passwordHash: hash, firstName: "Admin", lastName: "BâtiPro", phone: "+213550000001", role: "ADMIN" },
  });

  const client = await prisma.user.upsert({
    where: { email: "client@ar-bati.com" },
    update: {},
    create: { email: "client@ar-bati.com", passwordHash: hash, firstName: "Karim", lastName: "Benali", phone: "+213550000002", role: "CLIENT" },
  });

  // ── Public showcase projects ───────────────────────────────────────────────
  const publicProjects = [
    { id: "pub-1", name: "Tour Horizon",             location: "Mahdia, Zahra",  type: "Commercial",  year: "2026", description: "Tour de bureaux de 35 étages avec certification HQE et architecture bioclimatique.", status: "En cours",    phase: "Gros œuvre", progress: 72, budget: 850000,  spent: 612000, startDate: new Date("2024-01-01"), endDate: new Date("2026-12-31") },
    { id: "pub-2", name: "Résidence Les Jardins",    location: "Sousse, Tunisie", type: "Résidentiel", year: "2025", description: "Ensemble résidentiel de 120 logements avec espaces verts intégrés.",               status: "En cours",    phase: "Second œuvre", progress: 45, budget: 1200000, spent: 540000, startDate: new Date("2024-03-01"), endDate: new Date("2025-12-31") },
    { id: "pub-3", name: "Centre Commercial Étoile", location: "Tunis, Lac",     type: "Commercial",  year: "2027", description: "Centre commercial moderne avec 80 boutiques et parking souterrain.",                status: "Planification", phase: "Études",    progress: 10, budget: 3100000, spent: 310000, startDate: new Date("2025-01-01"), endDate: new Date("2027-06-30") },
    { id: "pub-4", name: "Villa Moderne",            location: "Hammamet, Tunisie", type: "Résidentiel", year: "2025", description: "Villa contemporaine avec piscine et jardin paysager.",                          status: "Finition",    phase: "Finitions",  progress: 90, budget: 320000,  spent: 288000, startDate: new Date("2024-06-01"), endDate: new Date("2025-09-30") },
    { id: "pub-5", name: "Hôtel Azur",               location: "Djerba, Tunisie", type: "Hôtellerie",  year: "2026", description: "Hôtel 4 étoiles de 200 chambres en bord de mer.",                               status: "En cours",    phase: "Gros œuvre", progress: 55, budget: 2500000, spent: 1375000, startDate: new Date("2024-09-01"), endDate: new Date("2026-08-31") },
  ];

  for (const p of publicProjects) {
    await prisma.project.upsert({
      where: { id: p.id },
      update: {},
      create: { ...p, clientId: null },
    });
  }

  // ── Client projects ────────────────────────────────────────────────────────
  await prisma.project.upsert({
    where: { id: "seed-project-1" },
    update: {},
    create: { id: "seed-project-1", name: "Villa Moderne — Hammamet", description: "Villa contemporaine avec piscine et jardin paysager.", status: "En cours", phase: "Gros œuvre", progress: 65, budget: 320000, spent: 208000, startDate: new Date("2025-03-01"), endDate: new Date("2025-12-20"), clientId: client.id },
  });

  await prisma.project.upsert({
    where: { id: "seed-project-2" },
    update: {},
    create: { id: "seed-project-2", name: "Extension Bureau — Tunis", description: "Agrandissement et modernisation de bureaux.", status: "Planification", phase: "Études", progress: 15, budget: 95000, spent: 14000, startDate: new Date("2025-06-01"), endDate: new Date("2026-02-28"), clientId: client.id },
  });

  // ── Services ───────────────────────────────────────────────────────────────
  const services = [
    { id: "svc-1", icon: "fa-pencil-ruler",       label: "Conception Architecturale", desc: "Nous réalisons des plans 2D, 3D et BIM.",                    order: 1 },
    { id: "svc-2", icon: "fa-helmet-safety",       label: "Maîtrise d'Œuvre",          desc: "Gestion complète du chantier et coordination.",              order: 2 },
    { id: "svc-3", icon: "fa-building",            label: "Construction Neuve",         desc: "Construction de maisons et bâtiments modernes.",             order: 3 },
    { id: "svc-4", icon: "fa-screwdriver-wrench",  label: "Rénovation & Extension",     desc: "Modernisation et agrandissement des bâtiments.",             order: 4 },
    { id: "svc-5", icon: "fa-lightbulb",           label: "Conseil & Études",           desc: "Études techniques et audits énergétiques.",                  order: 5 },
    { id: "svc-6", icon: "fa-leaf",                label: "Architecture Durable",       desc: "Conception écologique et matériaux durables.",               order: 6 },
  ];

  for (const s of services) {
    await prisma.service.upsert({ where: { id: s.id }, update: {}, create: s });
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = [
    { id: "stat-1", label: "Projets Réalisés",   value: "150",  sub: "depuis 2010",                  order: 1 },
    { id: "stat-2", label: "Clients Satisfaits", value: "120",  sub: "particuliers & entreprises",   order: 2 },
    { id: "stat-3", label: "M² Construits",      value: "85K",  sub: "tous types confondus",         order: 3 },
    { id: "stat-4", label: "Budget Géré",        value: "250M€", sub: "sur 15 ans",                  order: 4 },
  ];

  for (const s of stats) {
    await prisma.stat.upsert({ where: { id: s.id }, update: {}, create: s });
  }

  console.log("✅ Seed completed.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
