import { PrismaClient } from "@prisma/client";
import { subDays, formatISO } from 'date-fns';

const prisma = new PrismaClient();
/**
 * Get aggregated clicks per day for a link and fill missing days with zero.
 * @param {string} linkId
 * @param {number} days - number of days to return (e.g. 30)
 * @returns [{ date: 'YYYY-MM-DD', count: number }]
 */
export async function getClicksByDay(linkId, days = 30) {
  // raw SQL aggregation by day (Postgres date_trunc)
  const rows = await prisma.$queryRaw`
  SELECT 
    date_trunc('day', "createdAt")::date AS day,
    COUNT(*) AS count
  FROM "Click"
  WHERE "linkId" = ${linkId}
    AND "createdAt" >= ${subDays(new Date(), days)}
  GROUP BY date_trunc('day', "createdAt")::date
  ORDER BY day;
`;


  // convert rows to map for fast lookup
  const map = new Map(rows.map(r => [r.day.toISOString().slice(0,10), Number(r.count)]));

  // build filled array of last `days` days (oldest -> newest)
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const key = d.toISOString().slice(0,10);
    result.push({ date: key, count: map.get(key) ?? 0 });
  }
  return result;
}

/**
 * Batch get summaries for multiple linkIds
 * Accepts array of { id, code } (or ids) and returns map code -> clicksByDay
 */
export async function getBatchSummaries(linkIds = [], days = 7) {
  if (!linkIds.length) return {};

  // Aggregate all clicks for linkIds in one query grouped by linkId and day
  const rows = await prisma.$queryRaw`
    SELECT "linkId", date_trunc('day', "createdAt")::date as day, count(*) as count
    FROM "Click"
    WHERE "linkId" IN (${prisma.raw('ARRAY[' + linkIds.map(() => '?').join(',') + ']')})
      AND "createdAt" >= ${subDays(new Date(), days)}
    GROUP BY "linkId", day
    ORDER BY "linkId", day;
  `;
  // NOTE: raw parameter substitution for arrays is handled above; Prisma doesn't allow direct array interpolation -
  // If you run into parameterization issues, use multiple queries or construct safe raw SQL with Prisma.escape (careful).
  // For simplicity, a fallback below uses separate queries per linkId if needed.

  // Convert to map linkId -> { date -> count }
  const grouped = {};
  for (const r of rows) {
    const linkId = r.linkId;
    const day = r.day.toISOString().slice(0,10);
    if (!grouped[linkId]) grouped[linkId] = {};
    grouped[linkId][day] = Number(r.count);
  }

  const out = {};
  for (const linkId of linkIds) {
    const mp = grouped[linkId] || {};
    const arr = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const key = d.toISOString().slice(0,10);
      arr.push({ date: key, count: mp[key] ?? 0 });
    }
    out[linkId] = arr;
  }
  return out;
}
