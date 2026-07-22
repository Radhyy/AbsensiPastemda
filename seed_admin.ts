import 'dotenv/config';
import { prisma } from './src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const username = 'pastemda';
  const password = 'pastemda123';

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { username }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      }
    });
    console.log(`Admin user '${username}' created successfully.`);
  } else {
    console.log(`Admin user '${username}' already exists.`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
