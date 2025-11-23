import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function health(req, res) {
  const start = Date.now();
  let db = { ok: false, latencyMs: null };
  try {
    const t0 = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    db.ok = true;
    db.latencyMs = Date.now() - t0;
  } catch (e) {
    db.ok = false;
  }

  return res.status(200).json({
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    db,
    version: process.env.npm_package_version || '0.1.0',
    env: process.env.NODE_ENV || 'development'
  });
}
