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

  // 5. Create specific branch accounts mentioned in README
  // Note: These use the 'staffAccount' format as the employee/student ID
  const branchConfigs = [
    { branch: 'branch-1', prefix: 'commonwealth', name: 'Commonwealth' },
    { branch: 'branch-2', prefix: 'montalban', name: 'Montalban' }
  ];

  for (const config of branchConfigs) {
    // Staff
    await prisma.user.upsert({
      where: { email: `${config.prefix}.staff@educore.ph` },
      update: { passwordHash },
      create: {
        email: `${config.prefix}.staff@educore.ph`,
        firstName: config.name,
        lastName: 'Staff',
        passwordHash,
        role: 'staff',
        status: 'active',
        branchId: config.branch,
        staff: {
          create: {
            employeeId: `${config.prefix}.staff`, // This allows login with this ID
            position: 'Staff',
            department: 'General'
          }
        }
      }
    });

    // Student
    await prisma.user.upsert({
      where: { email: `${config.prefix}.student@educore.ph` },
      update: { passwordHash },
      create: {
        email: `${config.prefix}.student@educore.ph`,
        firstName: config.name,
        lastName: 'Student',
        passwordHash,
        role: 'student',
        status: 'active',
        branchId: config.branch,
        student: {
          create: {
            studentId: `${config.prefix}.student`, // This allows login with this ID
            dateOfBirth: new Date('2005-05-05'),
            gender: 'other',
            nationality: 'Filipino',
            civilStatus: 'single',
            courseId: 'BSBA',
            yearLevel: '1st',
            academicYearId: 'ay-2024',
            educationLevel: 'college',
            emergencyContactName: 'Contact',
            emergencyContactPhone: '09123456789',
            emergencyContactRelation: 'Guardian'
          }
        }
      }
    });
  }

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
