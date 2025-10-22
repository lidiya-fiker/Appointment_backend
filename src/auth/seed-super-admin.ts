// src/auth/seed-roles-and-super-admin.ts
import { DataSource, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';
import { Role } from 'src/roles/role.entity';
import { Permission } from 'src/roles/permission.entity';
import { PERMISSIONS } from 'src/roles/persmissions.constants';
import { ROLES } from 'src/roles/roles.constants';

export async function seedRolesAndSuperAdmin(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(Role);
  const permissionRepo = dataSource.getRepository(Permission);

  // 1️⃣ Ensure all permissions exist
  const permKeys = Object.values(PERMISSIONS);
  const existingPermissions = await permissionRepo.find({
    where: { key: In(permKeys) },
  });
  const missingKeys = permKeys.filter(
    (k) => !existingPermissions.some((p) => p.key === k),
  );

  for (const key of missingKeys) {
    const perm = permissionRepo.create({ key, description: key });
    await permissionRepo.save(perm);
    existingPermissions.push(perm);
    console.log(`✅ Permission created: ${key}`);
  }

  const getPerms = (keys: string[]) =>
    existingPermissions.filter((p) => keys.includes(p.key));

  // 2️⃣ Create roles if not exist
  for (const [roleName, perms] of Object.entries(ROLES)) {
    let role = await roleRepo.findOne({
      where: { name: roleName },
      relations: ['permissions'],
    });
    if (!role) {
      role = roleRepo.create({ name: roleName, permissions: getPerms(perms) });
      await roleRepo.save(role);
      console.log(`🧩 Role created: ${roleName}`);
    }
  }
}
  // 3️⃣ Create CEO user if not exists
//   const ceoRole = await roleRepo.findOne({
//     where: { name: 'CEO' },
//     relations: ['permissions'],
//   });
//   const existingCeo = await userRepo.findOne({
//     where: { email: 'ceo@company.com' },
//   });

//   if (!existingCeo) {
//     const hashedPassword = await bcrypt.hash('superadmin123', 10);
//     const ceo = userRepo.create({
//       firstName: 'System',
//       lastName: 'CEO',
//       email: 'ceo@company.com',
//       password: hashedPassword,
//       role: ceoRole,
//     });
//     await userRepo.save(ceo);
//     console.log('✅ Super Admin (CEO) created with all permissions');
//   } else {
//     console.log('✅ Super Admin (CEO) already exists');
//   }
// }
