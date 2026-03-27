import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
p.user.updateMany({ where: { emailVerified: false }, data: { emailVerified: true } })
  .then((r: { count: number }) => console.log("✅ Verified", r.count, "existing users"))
  .finally(() => p.$disconnect());
