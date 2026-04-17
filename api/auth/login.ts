import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

  const { email, password, studentId } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    // 1. Find the user based on email OR studentId
    let user = null;

    if (email) {
      user = await prisma.user.findUnique({
        where: { email },
        include: {
          student: true,
          staff: true,
        },
      });
    } else if (studentId) {
      // Find the student record first to get the user ID
      const student = await prisma.student.findUnique({
        where: { studentId },
        include: {
          user: {
            include: {
              student: true,
              staff: true,
            },
          },
        },
      });
      user = student?.user;
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Verify password
    if (!user.passwordHash) {
      return res.status(401).json({ message: 'Account not set up. Please reset your password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Map Prisma user to the Frontend User format
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
  } finally {
    await prisma.$disconnect();
  }
}
