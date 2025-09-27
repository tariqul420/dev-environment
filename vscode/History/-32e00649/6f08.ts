'use server';
import { normalizeUrl } from '@/lib/normalize-url';

import crypto from 'node:crypto';
import prisma from '../prisma';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

async function slugExists(slug: string) {
  const link = await prisma.link.findUnique({ where: { short: slug } });
  return !!link;
}

export async function generateUniqueSlug() {
  // try short first, grow if needed
  for (let len = 4; len <= 8; len++) {
    for (let tries = 0; tries < 4; tries++) {
      let s = '';
      for (let i = 0; i < len; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      if (!(await slugExists(s))) return s;
    }
  }
  // last resort
  return crypto.randomBytes(6).toString('base64url');
}

export async function createShort({ url, preferredSlug, userId }: { url: string; preferredSlug?: string | null; userId?: string | null }) {
  const targetUrl = normalizeUrl(url);
  if (!targetUrl) return { ok: false as const, error: 'INVALID_URL' };

  // de-dup global (you can scope by user if you want)
  const existing = await prisma.link.findFirst({ where: { targetUrl } });
  if (existing) {
    return { ok: true as const, existed: true, link: existing };
  }

  let short = preferredSlug?.trim() || '';
  if (short) {
    // sanitize
    short = short.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
    const taken = await prisma.link.findUnique({ where: { short } });
    if (taken) short = '';
  }
  if (!short) short = await generateUniqueSlug();

  const link = await prisma.link.create({ data: { short, targetUrl, userId: userId ?? null } });
  return { ok: true as const, existed: false, link };
}
