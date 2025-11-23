import * as analyticsService from '../services/analyticsService.js';
import { PrismaClient } from "@prisma/client";


import * as linkService from '../services/linkService.js';


const prisma = new PrismaClient();
/**
 * GET /api/links/:code/summary?days=30
 * Returns clicksByDay filled for requested days (default 30), plus recentClicks and totals
 */
export async function getSummaryForCode(req, res, next) {
  try {
    const { code } = req.params;
    const days = Math.min(Number(req.query.days || 30), 365);

    const link = await linkService.findLinkByCode(code);
    if (!link) return res.status(404).json({ error: 'Not found' });

    const clicksByDay = await analyticsService.getClicksByDay(link.id, days);

    const recent = await prisma.click.findMany({
      where: { linkId: link.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return res.status(200).json({
      id: link.id,
      code: link.code,
      targetUrl: link.targetUrl,
      clicks: link.clicks,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt,
      clicksByDay,
      recentClicks: recent.map(c => ({ ts: c.createdAt, ip: c.ip, ua: c.ua, referrer: c.referrer }))
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/links/summary
 * Body: { codes: ['abc123','xyz789'], days: 7 }
 * Returns map code -> clicksByDay
 */
export async function batchSummaries(req, res, next) {
  try {
    const { codes = [], days = 7 } = req.body;
    if (!Array.isArray(codes) || codes.length === 0) {
      return res.status(400).json({ error: 'codes array required' });
    }
    // fetch link ids for the codes
    const links = await prisma.link.findMany({
      where: { code: { in: codes }, isDeleted: false },
      select: { id: true, code: true }
    });
    const idMap = {};
    links.forEach(l => (idMap[l.id] = l.code));

    // get summaries (fallback to per-link queries if needed)
    const linkIds = links.map(l => l.id);
    const summariesById = await analyticsService.getBatchSummaries(linkIds, days);

    // remap to code -> summary
    const out = {};
    for (const id of Object.keys(summariesById)) {
      const code = idMap[id];
      if (code) out[code] = summariesById[id];
    }

    return res.status(200).json(out);
  } catch (err) {
    return next(err);
  }
}
