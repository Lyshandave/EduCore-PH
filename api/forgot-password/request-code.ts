import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  addMinutes,
  CODE_EXPIRY_MINUTES,
  enforcePost,
  generateResetCode,
  getLatestActiveResetCode,
  handleOptions,
  hashValue,
  isValidEmail,
  normalizeEmail,
  prisma,
  sendResetCodeEmail,
} from './_shared';

const GENERIC_SUCCESS_MESSAGE =
  'If an account exists for this email, a verification code has been sent.';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;
  if (!enforcePost(req, res)) return;

  const email = normalizeEmail(String(req.body?.email ?? ''));

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.',
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: GENERIC_SUCCESS_MESSAGE,
      });
    }

    const existingCode = await getLatestActiveResetCode(email);

    if (existingCode) {
      return res.status(200).json({
        success: true,
        message: GENERIC_SUCCESS_MESSAGE,
      });
    }

    const code = generateResetCode();

    await prisma.passwordResetCode.create({
      data: {
        userId: user.id,
        email: user.email,
        codeHash: hashValue(code),
        expiresAt: addMinutes(new Date(), CODE_EXPIRY_MINUTES),
      },
    });

    await sendResetCodeEmail(email, code);

    return res.status(200).json({
      success: true,
      message: GENERIC_SUCCESS_MESSAGE,
    });
  } catch (error) {
    console.error('Forgot password request-code error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to send a verification code right now. Please try again later.',
    });
  }
}
