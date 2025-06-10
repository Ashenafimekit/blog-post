import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const password =
    process.env.SEED_PASSWORD || 'change this password with your password';
  const hashedPassword = bcrypt.hashSync(password, 10);

  const melos = await prisma.user.upsert({
    where: { email: 'melos@gmail.com' },
    update: {},
    create: {
      name: 'Melos',
      email: 'melos@melody.com',
      password: hashedPassword,
      role: 'ADMIN',
      posts: {
        create: {
          title: 'First Post',
          content: 'This is the content of the first post.',
          published: true,
        },
      },
    },
  });

  const ashe = await prisma.user.upsert({
    where: { email: 'ashe@gmail.com' },
    update: {},
    create: {
      name: 'ashe',
      email: 'ashe@gmail.com',
      password: hashedPassword,
      role: 'USER',
      posts: {
        create: {
          title: 'Second Post',
          content: 'This is the content of the second post.',
          published: false,
        },
      },
    },
  });
  console.log(ashe, melos);
}

main()
  .then(async () => {
    console.log('Seeding completed');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
