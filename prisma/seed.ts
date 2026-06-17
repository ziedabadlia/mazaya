import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL!),
});

async function main() {
  const email = "admin@mazaya.com";
  const password = "admin123456";

  const existingTenant = await prisma.tenant.upsert({
    where: { slug: "mazaya-system" },
    update: {},
    create: {
      name: "Mazaya System",
      slug: "mazaya-system",
      status: "ACTIVE",
    },
  });

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Super Admin",
      password: await bcrypt.hash(password, 10),
      role: "SUPER_ADMIN",
      tenantId: existingTenant.id,
    },
  });

  console.log("✅ Super admin seeded:");
  console.log(`   Email:    ${email}`);
  console.log(`   Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
