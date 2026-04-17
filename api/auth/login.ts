import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../forgot-password/_shared';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-32-chars-long-at-least';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email: emailInputField, password, studentId: explicitStudentId } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  const loginIdentifier = (emailInputField || '').trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginIdentifier);

  try {
    let user = null;

    if (explicitStudentId || (!isEmail && loginIdentifier)) {
      const sId = explicitStudentId || loginIdentifier;
      // Find by studentId or employeeId
      const student = await prisma.student.findUnique({
        where: { studentId: sId },
        include: { user: { include: { student: true, staff: true } } },
      });

      if (student) {
        user = student.user;
      } else {
        // Try staff employeeId
        const staff = await prisma.staff.findUnique({
          where: { employeeId: sId },
          include: { user: { include: { student: true, staff: true } } },
        });
        user = staff?.user;
      }
    } else if (isEmail) {
      user = await prisma.user.findUnique({
        where: { email: loginIdentifier.toLowerCase() },
        include: {
          student: true,
          staff: true,
        },
      });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.passwordHash) {
      return res.status(401).json({ message: 'Account not set up. Please reset your password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const formattedUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      role: user.role,
      status: user.status,
      avatar: user.avatar || undefined,
      branchId: user.branchId,
      studentId: user.student?.studentId || user.staff?.employeeId || undefined,
    };

    const tokens = {
      accessToken: jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' }
      ),
      refreshToken: jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: '7d' }
      ),
      expiresIn: 86400,
    };

    return res.status(200).json({
      user: formattedUser,
      tokens,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

