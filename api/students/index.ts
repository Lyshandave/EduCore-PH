import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const students = await prisma.student.findMany({
        include: {
          user: true,
        },
      });
      
      // Map Prisma result back to Student interface format
      const formattedStudents = students.map((s) => ({
        ...s.user,
        ...s,
        id: s.id,
        user: undefined, // remove nested user object
      }));

      return res.status(200).json(formattedStudents);
    }

    if (req.method === 'POST') {
      const data = req.body;
      
      const newStudent = await prisma.user.create({
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'student',
          status: 'pending',
          branchId: data.branchId || 'Main',
          student: {
            create: {
              studentId: data.studentId || `ST-${Math.floor(Math.random() * 100000)}`,
              dateOfBirth: new Date(data.dateOfBirth || Date.now()),
              gender: data.gender || 'other',
              nationality: data.nationality || 'Filipino',
              civilStatus: data.civilStatus || 'single',
              emergencyContactName: data.emergencyContactName || 'N/A',
              emergencyContactPhone: data.emergencyContactPhone || 'N/A',
              emergencyContactRelation: data.emergencyContactRelation || 'N/A',
              educationLevel: data.educationLevel || 'college',
              courseId: data.courseId || 'BSIT',
              yearLevel: data.yearLevel || '1st',
              academicYearId: data.academicYearId || 'ay-2024',
              enrollmentStatus: 'pending',
              paymentStatus: 'unpaid',
            }
          }
        },
        include: {
          student: true,
        }
      });

      return res.status(201).json(newStudent);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', error: String(error) });
  } finally {
    await prisma.$disconnect();
  }
}
