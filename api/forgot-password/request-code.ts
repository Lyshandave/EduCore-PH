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
  'If an account exists, a verification code has been sent to the registered email.';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;
  if (!enforcePost(req, res)) return;

  const input = String(req.body?.email ?? '').trim();
  
  if (!input) {
    return res.status(400).json({
      success: false,
      message: 'Please enter your email or system ID.',
    });
  }

  const isEmail = isValidEmail(input);
  const identifier = isEmail ? normalizeEmail(input) : input;

  try {
    let user = null;

    if (isEmail) {
      user = await prisma.user.findUnique({
        where: { email: identifier },
        select: { id: true, email: true },
      });
    } else {
      // Try Student ID
      const student = await prisma.student.findUnique({
        where: { studentId: identifier },
        include: { user: { select: { id: true, email: true } } },
      });
      
      if (student) {
        user = student.user;
      } else {
        // Try Staff ID
        const staff = await prisma.staff.findUnique({
          where: { employeeId: identifier },
          include: { user: { select: { id: true, email: true } } },
        });
        user = staff?.user;
      }
    }

    if (!user || !user.email) {
      return res.status(200).json({
        success: true,
        message: GENERIC_SUCCESS_MESSAGE,
      });
    }

    const email = user.email;
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
        email: email,
        codeHash: hashValue(code),
        expiresAt: addMinutes(new Date(), CODE_EXPIRY_MINUTES),
      },
    });

    await sendResetCodeEmail(email, code);

    return res.status(200).json({
      success: true,
      message: isEmail 
        ? GENERIC_SUCCESS_MESSAGE 
        : `A verification code has been sent to your registered email: ${maskEmail(email)}`,
    });
  } catch (error) {
    console.error('Forgot password request-code error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to send a verification code right now. Please try again later.',
    });
  }
}

function maskEmail(email: string) {
  const [name, domain] = email.split('@');
  if (name.length <= 2) return `${name[0]}***@${domain}`;
  return `${name[0]}${name[1]}***${name[name.length - 1]}@${domain}`;
}

