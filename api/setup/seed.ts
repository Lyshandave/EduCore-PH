import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow in development or via a secret key if you want, but for now we'll just allow it
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 1. Create Branches
    const branches = [
      { name: 'Commonwealth', code: 'CW' },
      { name: 'Montalban', code: 'MB' },
      { name: 'Taytay', code: 'TT' },
    ];

    for (const b of branches) {
      await prisma.branch.upsert({
        where: { code: b.code },
        update: {},
        create: {
          name: b.name,
          code: b.code,
          address: `${b.name} Address`,
          city: b.name,
          province: 'Metro Manila',
          zipCode: '1100',
          phone: '09123456789',
          email: `${b.name.toLowerCase()}@educore.ph`,
        },
      });
    }

    // 2. Create Admin
    await prisma.user.upsert({
      where: { email: 'admin@educore.ph' },
      update: {},
      create: {
        email: 'admin@educore.ph',
        firstName: 'System',
        lastName: 'Admin',
        role: 'admin',
        status: 'active',
        branchId: 'Main',
        emailVerified: true,
      },
    });

    // 3. Create Staff
    await prisma.user.upsert({
      where: { email: 'staff@educore.ph' },
      update: {},
      create: {
        email: 'staff@educore.ph',
        firstName: 'Default',
        lastName: 'Staff',
        role: 'staff',
        status: 'active',
        branchId: 'Commonwealth',
        emailVerified: true,
        staff: {
          create: {
            employeeId: 'EMP-001',
            department: 'Academic',
            position: 'Registrar',
          }
        }
      },
    });

    // 4. Create Student
    await prisma.user.upsert({
      where: { email: 'dave@gmail.com' },
      update: {},
      create: {
        email: 'dave@gmail.com',
        firstName: 'TOMO LYSHAN',
        lastName: 'DAVE B.',
        role: 'student',
        status: 'active',
        branchId: 'Commonwealth',
        emailVerified: true,
        student: {
          create: {
            studentId: '241023',
            dateOfBirth: new Date('2005-01-01'),
            gender: 'male',
            nationality: 'Filipino',
            civilStatus: 'single',
            emergencyContactName: 'N/A',
            emergencyContactPhone: '09123456789',
            emergencyContactRelation: 'Guardian',
            educationLevel: 'college',
            courseId: 'BSIT',
            yearLevel: '1st',
            academicYearId: 'ay-2024',
          }
        }
      },
    });

    return res.status(200).json({ message: 'Database seeded successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Seeding failed', error: String(error) });
  } finally {
    await prisma.$disconnect();
  }
}
