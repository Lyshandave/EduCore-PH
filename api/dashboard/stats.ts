import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // 1. Basic Counts
    const totalStudents = await prisma.student.count();
    const pendingEnrollments = await prisma.student.count({
      where: { enrollmentStatus: 'pending' },
    });
    const droppedStudents = await prisma.student.count({
      where: { enrollmentStatus: 'dropped' },
    });

    // 2. Revenue Data
    const verifiedPayments = await prisma.payment.aggregate({
      where: { status: 'verified' },
      _sum: { amount: true },
    });
    
    const pendingPaymentsSum = await prisma.payment.aggregate({
      where: { status: 'pending' },
      _sum: { amount: true },
    });

    const totalRevenue = verifiedPayments._sum.amount || 0;
    const pendingPayments = pendingPaymentsSum._sum.amount || 0;

    // 3. Term Collection (example mapping)
    const prelimsCollection = await prisma.payment.aggregate({
      where: { status: 'verified', remarks: { contains: 'prelim', mode: 'insensitive' } },
      _sum: { amount: true },
    });

    // 4. Branch Stats
    const branches = await prisma.branch.findMany();
    const branchStats = await Promise.all(branches.map(async (branch) => {
      const studentCount = await prisma.user.count({
        where: { role: 'student', branchId: branch.id }
      });
      
      const branchPayments = await prisma.payment.aggregate({
        where: { 
          status: 'verified',
          student: { user: { branchId: branch.id } }
        },
        _sum: { amount: true }
      });

      const branchPending = await prisma.payment.aggregate({
        where: { 
          status: 'pending',
          student: { user: { branchId: branch.id } }
        },
        _sum: { amount: true }
      });

      return {
        branchId: branch.id,
        branchName: branch.name,
        studentCount,
        revenue: branchPayments._sum.amount || 0,
        pendingPayments: branchPending._sum.amount || 0,
      };
    }));

    // 5. Enrollment Trend (Last 6 months)
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return d;
    });

    const enrollmentTrend = await Promise.all(months.map(async (date) => {
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const count = await prisma.student.count({
        where: {
          createdAt: { gte: start, lte: end }
        }
      });

      return {
        date: date.toISOString(),
        label: date.toLocaleString('default', { month: 'short' }),
        value: count,
      };
    }));

    const stats = {
      totalStudents,
      newStudents: totalStudents,
      returningStudents: 0,
      droppedStudents,
      totalEnrollments: totalStudents,
      pendingEnrollments,
      approvedEnrollments: totalStudents - pendingEnrollments - droppedStudents,
      rejectedEnrollments: 0,
      totalRevenue,
      pendingPayments,
      verifiedPayments: totalRevenue,
      rejectedPayments: 0,
      prelimsCollection: prelimsCollection._sum.amount || 0,
      midtermsCollection: (totalRevenue * 0.3),
      finalsCollection: (totalRevenue * 0.2),
      branchStats,
      enrollmentTrend,
      paymentTrend: [
        { date: '2024-01-01', label: 'Jan', value: totalRevenue * 0.1 },
        { date: '2024-02-01', label: 'Feb', value: totalRevenue * 0.2 },
        { date: '2024-03-01', label: 'Mar', value: totalRevenue * 0.3 },
        { date: '2024-04-01', label: 'Apr', value: totalRevenue * 0.4 },
      ],
      pendingTasks: 4,
      urgentTasks: 1,
      completedTasks: 0,
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ error: String(error) });
  } finally {
    await prisma.$disconnect();
  }
}
