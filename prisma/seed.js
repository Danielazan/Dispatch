import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Seed Permissions (Decision 6)
  const permissionKeys = [
    'leads.view', 'leads.resend',
    'carriers.view', 'carriers.approve',
    'documents.view', 'documents.review',
    'verification.view', 'verification.override',
    'loads.view', 'loads.manage',
    'staff.manage', 'roles.manage'
  ];

  const permissions = [];
  for (const key of permissionKeys) {
    const perm = await prisma.adminPermission.upsert({
      where: { key },
      update: {},
      create: { key, description: `Permission to ${key.replace('.', ' ')}` },
    });
    permissions.push(perm);
  }

  // 2. Seed Roles
  const superAdminRole = await prisma.adminRole.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: { name: 'Super Admin', isSuperAdmin: true },
  });

  const dispatcherRole = await prisma.adminRole.upsert({
    where: { name: 'Dispatcher' },
    update: {},
    create: { name: 'Dispatcher', isSuperAdmin: false },
  });

  const complianceRole = await prisma.adminRole.upsert({
    where: { name: 'Compliance' },
    update: {},
    create: { name: 'Compliance', isSuperAdmin: false },
  });

  // 3. Map Permissions to Roles
  const dispatcherPerms = permissions.filter(p => 
    ['leads.view', 'leads.resend', 'carriers.view', 'loads.view', 'loads.manage'].includes(p.key)
  );
  
  const compliancePerms = permissions.filter(p => 
    ['carriers.view', 'documents.view', 'documents.review', 'verification.view', 'verification.override', 'carriers.approve'].includes(p.key)
  );

  // Clear existing mappings to ensure idempotency
  await prisma.adminRolePermission.deleteMany({});

  for (const perm of dispatcherPerms) {
    await prisma.adminRolePermission.create({
      data: { roleId: dispatcherRole.id, permissionId: perm.id }
    });
  }

  for (const perm of compliancePerms) {
    await prisma.adminRolePermission.create({
      data: { roleId: complianceRole.id, permissionId: perm.id }
    });
  }

  // 4. Seed Super Admin User
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  
  await prisma.adminUser.upsert({
    where: { email: 'admin@aikfreight.com' },
    update: {},
    create: {
      email: 'admin@aikfreight.com',
      passwordHash: hashedPassword,
      fullName: 'System Administrator',
      isActive: true,
      roleId: superAdminRole.id,
    },
  });

  console.log('✅ Seeding complete!');
  console.log('👤 Super Admin Login: admin@aikfreight.com / Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });