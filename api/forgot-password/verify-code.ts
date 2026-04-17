import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  enforcePost,
  getLatestActiveResetCode,
  handleOptions,
  isValidEmail,
  MAX_VERIFICATION_ATTEMPTS,
  normalizeEmail,
  prisma,
  verifyHashedValue,
} from './_shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;
  if (!enforcePost(req, res)) return;

  const email = normalizeEmail(String(req.body?.email ?? ''));
  const code = String(req.body?.code ?? '').trim();

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.',
    });
  }

  if (!/^\d{6}$/.test(code)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter the 6-digit verification code.',
    });
  }

  try {
    const resetCode = await getLatestActiveResetCode(email);

    if (!resetCode || resetCode.usedAt) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code.',
      });
    }

    if (resetCode.attemptCount >= MAX_VERIFICATION_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please request a new code.',
      });
    }

    const isValid = verifyHashedValue(code, resetCode.codeHash);

    if (!isValid) {
      await prisma.passwordResetCode.update({
        where: { id: resetCode.id },
        data: {
          attemptCount: {
            increment: 1,
          },
        },
      });

      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code.',
      });
    }

    await prisma.passwordResetCode.update({
      where: { id: resetCode.id },
      data: {
        verifiedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Code verified. You can now reset your password.',
    });
  } catch (error) {
    console.error('Forgot password verify-code error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to verify the code right now. Please try again later.',
    });
  }
}
