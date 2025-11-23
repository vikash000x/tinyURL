import * as linkService from '../services/linkService.js';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createLink(req, res, next) {
  try {
    console.log("brooo")
    const { targetUrl, code } = req.body;
    const ownerId = req.user?.id ?? null; // optional
    console.log("con1")
    const link = await linkService.createLink({ targetUrl, code, ownerId });
     console.log("con2")
    return res.status(201).json({
      id: link.id,
      code: link.code,
      targetUrl: link.targetUrl,
      clicks: link.clicks,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt
    });
  } catch (err) {
    // handle unique constraint violation (Prisma P2002)
    if (err?.code === 'P2002' && err.meta?.target?.includes('code')) {
      return res.status(409).json({ error: 'Code already exists' });
    }
    if (err.name === 'ZodError' || err.message === 'Invalid URL') {
      return res.status(400).json({ error: err.message || 'Invalid payload' });
    }
    return next(err);
  }
}

export async function listLinks(req, res, next) {
  try {
    const q = req.query.q ?? undefined;
    const limit = Math.min(parseInt(req.query.limit || '100', 10), 500);
    const offset = parseInt(req.query.offset || '0', 10);
    const links = await linkService.listLinks({ q, limit, offset });
    return res.status(200).json(links.map(l => ({
      id: l.id, code: l.code, targetUrl: l.targetUrl, clicks: l.clicks, lastClicked: l.lastClicked, createdAt: l.createdAt
    })));
  } catch (err) {
    return next(err);
  }
}

export async function getLinkStats(req, res, next) {
  try {
    const { code } = req.params;
    const link = await linkService.findLinkByCode(code);
    if (!link) return res.status(404).json({ error: 'Not found' });

    // FIXED QUERY
    const rows = await prisma.$queryRaw`
      SELECT 
        date_trunc('day', "createdAt")::date AS day,
        COUNT(*) AS count
      FROM "Click"
      WHERE "linkId" = ${link.id}
      GROUP BY date_trunc('day', "createdAt")::date
      ORDER BY day;
    `;

    const clicksByDay = rows.map(r => ({
      date: r.day.toISOString().slice(0, 10),
      count: Number(r.count)
    }));

    const recent = await prisma.click.findMany({
      where: { linkId: link.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return res.json({
      id: link.id,
      code: link.code,
      targetUrl: link.targetUrl,
      clicks: link.clicks,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt,
      clicksByDay,
      recentClicks: recent.map(c => ({
        ts: c.createdAt,
        ip: c.ip,
        ua: c.ua,
        referrer: c.referrer
      }))
    });
  } catch (err) {
    return next(err);
  }
}


export async function deleteLink(req, res, next) {
  try {
    const { code } = req.params;
    const ok = await linkService.deleteLinkByCode(code);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}
