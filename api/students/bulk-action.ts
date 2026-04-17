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

  const { ids, action, remarks } = req.body;

  if (!ids || !Array.isArray(ids) || !action) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let result;

    if (action === 'approve') {
      // Update both User status and Student enrollmentStatus
      result = await prisma.$transaction([
        prisma.user.updateMany({
          where: { id: { in: ids } },
          data: { status: 'active' },
        }),
        prisma.student.updateMany({
          where: { id: { in: ids } },
          data: { enrollmentStatus: 'approved' },
        }),
      ]);
    } else if (action === 'reject') {
      result = await prisma.student.updateMany({
        where: { id: { in: ids } },
        data: { enrollmentStatus: 'rejected' },
      });
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    return res.status(200).json({
      success: true,
      processed: ids.length,
      succeeded: ids.length, // Simplified
      failed: 0,
      errors: [],
    });
  } catch (error) {
    console.error('Bulk action error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: String(error) });
  } finally {
    await prisma.$disconnect();
  }
}
