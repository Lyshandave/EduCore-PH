import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const defaultPassword = 'password123';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(defaultPassword, salt);

  // 1. Create Branches
  const branches = await Promise.all([
    prisma.branch.upsert({
      where: { code: 'CW' },
      update: {},
      create: { 
        id: 'branch-1', 
        name: 'Commonwealth',
        code: 'CW',
        address: 'Quezon City',
        city: 'Quezon City',
        province: 'Metro Manila',
        zipCode: '1121',
        phone: '09123456789',
        email: 'commonwealth@educore.ph'
      }
    }),
    prisma.branch.upsert({
      where: { code: 'MB' },
      update: {},
      create: { 
        id: 'branch-2', 
        name: 'Montalban',
        code: 'MB',
        address: 'Rodriguez',
        city: 'Rodriguez',
        province: 'Rizal',
        zipCode: '1860',
        phone: '09123456788',
        email: 'montalban@educore.ph'
      }
    })
  ]);

  // 2. Create Admin
  await prisma.user.upsert({
    where: { email: 'admin@educore.ph' },
    update: { passwordHash },
    create: {
      email: 'admin@educore.ph',
      firstName: 'System',
      lastName: 'Admin',
      passwordHash,
      role: 'admin',
      status: 'active',
      branchId: 'branch-1'
    }
  });

  // 3. Create Student (Dave)
  await prisma.user.upsert({
    where: { email: 'dave@gmail.com' },
    update: { passwordHash },
    create: {
      email: 'dave@gmail.com',
      firstName: 'TOMO LYSHAN',
      lastName: 'DAVE B.',
      passwordHash,
      role: 'student',
      status: 'active',
      branchId: 'branch-1',
      student: {
        create: {
          studentId: '241023',
          dateOfBirth: new Date('2005-01-01'),
          gender: 'male',
          nationality: 'Filipino',
          civilStatus: 'single',
          courseId: 'BSIT',
          yearLevel: '1st',
          academicYearId: 'ay-2024',
          educationLevel: 'college',
          emergencyContactName: 'Juan Dela Cruz',
          emergencyContactPhone: '09123456789',
          emergencyContactRelation: 'Guardian',
          enrollmentStatus: 'approved',
          paymentStatus: 'partial'
        }
      }
    }
  });

  // 4. Create Staff
  await prisma.user.upsert({
    where: { email: 'staff@educore.ph' },
    update: { passwordHash },
    create: {
      email: 'staff@educore.ph',
      firstName: 'Demo',
      lastName: 'Staff',
      passwordHash,
      role: 'staff',
      status: 'active',
      branchId: 'branch-1',
      staff: {
        create: {
          employeeId: 'EMP-001',
          position: 'Registrar',
          department: 'Academic'
        }
      }
    }
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
