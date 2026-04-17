import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to database...');
    const userCount = await prisma.user.count();
    console.log(`Connection successful. Total users: ${userCount}`);
    
    const users = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        passwordHash: true
      }
    });
    
    console.log('Sample users:', JSON.stringify(users, null, 2));
    
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
