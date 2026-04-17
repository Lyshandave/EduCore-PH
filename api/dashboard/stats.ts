import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const totalStudents = await prisma.student.count();
    const totalStaff = await prisma.staff.count();
    const totalBranches = await prisma.branch.count();

    const stats = {
      totalStudents,
      newStudents: totalStudents, // simplified
      returningStudents: 0,
      droppedStudents: 0,
      totalEnrollments: totalStudents,
      pendingEnrollments: 0,
      approvedEnrollments: totalStudents,
      rejectedEnrollments: 0,
      totalRevenue: 0,
      pendingPayments: 0,
      verifiedPayments: 0,
      rejectedPayments: 0,
      prelimsCollection: 0,
      midtermsCollection: 0,
      finalsCollection: 0,
      branchStats: [],
      enrollmentTrend: [],
      paymentTrend: [],
      pendingTasks: 4,
      urgentTasks: 1,
      completedTasks: 0,
    };

    return res.status(200).json(stats);
  } catch (error) {
    return res.status(500).json({ error: String(error) });
  } finally {
    await prisma.$disconnect();
  }
}
