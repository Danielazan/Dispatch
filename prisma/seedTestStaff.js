import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const role = await prisma.adminRole.findUnique({ where: { name: 'Dispatcher' } });
  if (!role) throw new Error('Dispatcher role not found. Run npm run db:seed first.');

  await prisma.adminUser.upsert({
    where: { email: 'dispatcher@aikfreight.com' },
    update: {},
    create: {
      email: 'dispatcher@aikfreight.com',
      fullName: 'Test Dispatcher',
      passwordHash: await bcrypt.hash('Password123!', 10),
      roleId: role.id,
      isActive: true,
    },
  });

  console.log('✅ Test Dispatcher ready: dispatcher@aikfreight.com / Password123! (local only)');
}

main().finally(() => prisma.$disconnect());