import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, studentId } = req.body;

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

    // Map Prisma user to the Frontend User format
    // We use type casting or manual check to satisfy TS
    const formattedUser = {
      ...user,
      studentId: user.student?.studentId || user.staff?.employeeId || null,
      role: user.role,
    };

    const mockTokens = {
      accessToken: 'access-token-' + Math.random().toString(36).substring(2),
      refreshToken: 'refresh-token-' + Math.random().toString(36).substring(2),
      expiresIn: 3600,
    };

    return res.status(200).json({
      user: formattedUser,
      tokens: mockTokens,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
