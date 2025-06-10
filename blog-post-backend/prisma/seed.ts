import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const melos = await prisma.user.upsert({
    where: { email: 'melos@gmail.com' },
    update: {},
    create: {
      name: 'Melos',
      email: 'melos@melody.com',
      password: 'password',
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
      password: 'password',
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
