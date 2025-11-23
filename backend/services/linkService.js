import { z } from 'zod';
import { PrismaClient } from "@prisma/client";
import { generateCode } from './codeGenService.js';

const createSchema = z.object({
  targetUrl: z.string().min(5),
  code: z.string().regex(/^[A-Za-z0-9]{6,8}$/).optional()
});
const prisma = new PrismaClient();

// basic URL validator
function normalizeAndValidateUrl(raw) {
  try {
    const url = new URL(raw);
    // optionally enforce protocol
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid protocol');
    return url.toString();
  } catch (e) {
    // try adding http://
    try {
      const url = new URL('https://' + raw);
      return url.toString();
    } catch (err) {
      throw new Error('Invalid URL');
    }
  }
}

export async function createLink({ targetUrl: rawUrl, code: desiredCode, ownerId = null }) {
  const parsed = createSchema.parse({ targetUrl: rawUrl, code: desiredCode });

  const targetUrl = normalizeAndValidateUrl(parsed.targetUrl);
  let code = parsed.code;

  if (code) {
    // attempt create; let caller handle P2002 conflict
    const link = await prisma.link.create({
      data: { code, targetUrl, ownerId }
    });
    return link;
  } else {
    // generate candidate codes and attempt to create (handle race via unique constraint)
    for (let len = 6; len <= 8; len++) {
      for (let attempt = 0; attempt < 5; attempt++) {
        const candidate = generateCode(len);
        try {
          const link = await prisma.link.create({
            data: { code: candidate, targetUrl, ownerId }
          });
          return link;
        } catch (err) {
          // prisma unique violation will be handled by caller or retried
          if (err?.code === 'P2002') {
            // collision -> try again
            continue;
          }
          throw err;
        }
      }
    }
    throw new Error('Unable to generate unique code, try again');
  }
}

export async function findLinkByCode(code, includeDeleted = false) {
  const where = { code };
   console.log("yoos1")
  const link = await prisma.link.findUnique({ where });
   console.log("yoos")
  if (!link) return null;
  if (link.isDeleted && !includeDeleted) return null;
  return link;
}

export async function listLinks({ q, limit = 100, offset = 0 } = {}) {
  const where = {
    isDeleted: false,
    OR: q ? [
      { code: { contains: q } },
      { targetUrl: { contains: q } }
    ] : undefined
  };
  const links = await prisma.link.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset
  });
  return links;
}

export async function deleteLinkByCode(code) {
  // hard delete (uncomment soft delete if you prefer)
  console.log("nnn")
  const link = await prisma.link.findUnique({ where: { code } });
  if (!link) return null;
  console.log("nn1122", code, link)
 // Delete dependent clicks first
  await prisma.click.deleteMany({
    where: { linkId: link.id },
  });

  // Now delete the link
  await prisma.link.delete({
    where: { code },
  });
  return true;
}

