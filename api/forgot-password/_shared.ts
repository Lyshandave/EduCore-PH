import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'node:crypto';
import * as bcrypt from 'bcrypt';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export const CODE_EXPIRY_MINUTES = 10;
export const MAX_VERIFICATION_ATTEMPTS = 5;
export const PASSWORD_MIN_LENGTH = 8;

const PBKDF2_ITERATIONS = 120000;
const HASH_KEY_LENGTH = 64;
const HASH_DIGEST = 'sha512';

export function applyCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function handleOptions(req: VercelRequest, res: VercelResponse) {
  applyCors(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
}

export function enforcePost(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed.' });
    return false;
  }

  return true;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function generateResetCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

// Used for OTP codes
export function hashValue(value: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto
    .pbkdf2Sync(value, salt, PBKDF2_ITERATIONS, HASH_KEY_LENGTH, HASH_DIGEST)
    .toString('hex');

  return `pbkdf2$${PBKDF2_ITERATIONS}$${salt}$${derivedKey}`;
}

export function verifyHashedValue(value: string, storedHash: string) {
  const [algorithm, iterationsValue, salt, originalHash] = storedHash.split('$');

  if (algorithm !== 'pbkdf2' || !iterationsValue || !salt || !originalHash) {
    return false;
  }

  const iterations = Number(iterationsValue);
  if (!Number.isFinite(iterations) || iterations <= 0) {
    return false;
  }

  const derivedKey = crypto
    .pbkdf2Sync(value, salt, iterations, HASH_KEY_LENGTH, HASH_DIGEST)
    .toString('hex');

  return crypto.timingSafeEqual(Buffer.from(derivedKey), Buffer.from(originalHash));
}

// Used for Main Passwords
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export async function sendResetCodeEmail(email: string, code: string) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  const fromName = process.env.EMAILJS_FROM_NAME || 'EduCore PH';
  const appName = process.env.EMAILJS_APP_NAME || 'EduCore PH';

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    throw new Error(
      'EmailJS environment variables are missing. Required: EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY.'
    );
  }

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      origin: process.env.APP_ORIGIN || 'http://localhost:5173',
    },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: {
        to_email: email,
        email,
        passcode: code,
        otp_code: code,
        code,
        expiry_minutes: CODE_EXPIRY_MINUTES,
        from_name: fromName,
        app_name: appName,
        support_email: process.env.EMAILJS_SUPPORT_EMAIL || process.env.EMAILJS_REPLY_TO || fromName,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`EmailJS request failed with status ${response.status}: ${errorBody}`);
  }
}

export async function getLatestActiveResetCode(email: string) {
  return prisma.passwordResetCode.findFirst({
    where: {
      email,
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
