import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const staff = await prisma.staff.findMany({
        include: { user: true },
      });
      
      const formattedStaff = staff.map(s => ({
        ...s.user,
        ...s,
        id: s.id,
        user: undefined,
      }));
      
      return res.status(200).json(formattedStaff);
    }

    if (req.method === 'POST') {
      const data = req.body;
      
      const newStaff = await prisma.user.create({
        data: {
          email: data.email,
          firstName: data.firstName || data.name.split(' ')[0],
          lastName: data.lastName || data.name.split(' ').slice(1).join(' ') || 'Staff',
          role: 'staff',
          status: 'active',
          branchId: data.branchId || 'branch-1',
          staff: {
            create: {
              employeeId: data.employeeId || `STF-${Math.floor(Math.random() * 10000)}`,
              department: data.department || 'Administrative',
              position: data.position || 'Staff',
            }
          }
        },
        include: { staff: true }
      });
      
      return res.status(201).json(newStaff);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Staff API error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: String(error) });
  } finally {
    await prisma.$disconnect();
  }
}
