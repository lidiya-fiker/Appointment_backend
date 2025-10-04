// src/auth/seed-super-admin.ts
import { DataSource } from 'typeorm';
import { User, UserRole } from 'src/user/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedSuperAdmin(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);

  const existing = await userRepo.findOne({
    where: { email: 'ceo@company.com' },
  });
  if (existing) return;

  const hashed = await bcrypt.hash('superadmin123', 10);
  const ceo = userRepo.create({
    email: 'ceo@company.com',
    password: hashed,
    role: UserRole.CEO,
  });

  await userRepo.save(ceo);
  console.log('✅ Super Admin (CEO) created');
}
