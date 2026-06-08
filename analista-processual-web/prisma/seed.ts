import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_USER_EMAIL = "demo@analista-processual.local";

async function main() {
  const profile = await prisma.profile.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {},
    create: {
      email: DEMO_USER_EMAIL,
      fullName: "Usuário Demo",
    },
  });

  console.log(`Demo profile ready: ${profile.id} (${profile.email})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
