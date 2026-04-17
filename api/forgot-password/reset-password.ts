import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  enforcePost,
  getLatestActiveResetCode,
  handleOptions,
  isValidEmail,
  normalizeEmail,
  PASSWORD_MIN_LENGTH,
  prisma,
  hashPassword,
  verifyHashedValue,
} from './_shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;
  if (!enforcePost(req, res)) return;

  const email = normalizeEmail(String(req.body?.email ?? ''));
  const code = String(req.body?.code ?? '').trim();
  const newPassword = String(req.body?.newPassword ?? '');
  const confirmPassword = String(req.body?.confirmPassword ?? '');

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

  if (newPassword.length < PASSWORD_MIN_LENGTH) {
    return res.status(400).json({
      success: false,
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match.',
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Unable to reset password with the provided details.',
      });
    }

    const resetCode = await getLatestActiveResetCode(email);

    if (!resetCode || resetCode.usedAt) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code.',
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

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: await hashPassword(newPassword),
        },
      }),
      prisma.passwordResetCode.update({
        where: { id: resetCode.id },
        data: {
          usedAt: new Date(),
          verifiedAt: resetCode.verifiedAt ?? new Date(),
        },
      }),
      prisma.passwordResetCode.updateMany({
        where: {
          email,
          id: {
            not: resetCode.id,
          },
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Your password has been reset successfully.',
    });
  } catch (error) {
    console.error('Forgot password reset-password error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to reset your password right now. Please try again later.',
    });
  }
}
