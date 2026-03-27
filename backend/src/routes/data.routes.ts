import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";
import * as Data from "../controllers/data.controller";

const router = Router();

// Public
router.get ("/projects",             Data.getProjects);
router.get ("/stats",                Data.getStats);
router.get ("/services",             Data.getServices);
router.post("/register",             Data.registerClient);
router.post("/devis",                Data.submitDevis);

// Admin
router.get   ("/admin/kpis",         requireAuth, requireAdmin, Data.getAdminKpis);
router.get   ("/admin/users",        requireAuth, requireAdmin, Data.getAdminUsers);
router.post  ("/admin/users",        requireAuth, requireAdmin, Data.registerClient);
router.put   ("/admin/users/:id",    requireAuth, requireAdmin, Data.updateUser);
router.delete("/admin/users/:id",    requireAuth, requireAdmin, Data.deleteUser);
router.get   ("/admin/projects",     requireAuth, requireAdmin, Data.getAdminProjects);
router.post  ("/admin/projects",     requireAuth, requireAdmin, Data.createProject);
router.put   ("/admin/projects/:id", requireAuth, requireAdmin, Data.updateProject);
router.delete("/admin/projects/:id", requireAuth, requireAdmin, Data.deleteProject);
router.get   ("/admin/devis",        requireAuth, requireAdmin, Data.getAdminDevis);
router.put   ("/admin/devis/:id",    requireAuth, requireAdmin, Data.updateDevisStatus);

// Client
router.get("/client/projects",       requireAuth, Data.getClientProjects);
router.get("/client/documents",      requireAuth, Data.getClientDocuments);

export default router;
