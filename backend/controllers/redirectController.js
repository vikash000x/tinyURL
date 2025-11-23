import { PrismaClient } from "@prisma/client";
import * as linkService from '../services/linkService.js';


const prisma = new PrismaClient();
export async function handleRedirect(req, res, next) {
  try {
    const { code } = req.params;
    console.log("yooc")
    const link = await linkService.findLinkByCode(code);
    if (!link) return res.status(404).send('Not found');

    const ip = req.ip;
    const ua = req.get('User-Agent') ?? null;
    const referrer = req.get('Referrer') ?? null;

    // transaction: create click and increment link.clicks + lastClicked
    await prisma.$transaction([
      prisma.click.create({
        data: {
          linkId: link.id,
          ip,
          ua,
          referrer,
          day: new Date(new Date().toISOString().slice(0,10)) // midnight UTC
        }
      }),
      prisma.link.update({
        where: { id: link.id },
        data: { clicks: { increment: 1 }, lastClicked: new Date() }
      })
    ]);

    // Instead of redirecting here --> send URL to frontend
    res.json({ targetUrl: link.targetUrl });
    return res.status(302).send();
  } catch (err) {
    return next(err);
  }
}
