import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("No DATABASE_URL");

const db = new PrismaClient({
  adapter: new PrismaPg(databaseUrl),
});

async function main() {
  console.log("Seeding dummy owner accounts...");
  const numRecords = 45;

  const statuses: ("PENDING" | "ACTIVE" | "SUSPENDED")[] = ["PENDING", "ACTIVE", "SUSPENDED"];
  
  for (let i = 0; i < numRecords; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const slug = `seed-tenant-${i}-${Date.now()}`;
    // Create random created/approved dates within the last 30 days
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
    
    let approvedDate = null;
    if (status === "ACTIVE" || status === "SUSPENDED") {
      approvedDate = new Date(createdDate);
      approvedDate.setHours(approvedDate.getHours() + Math.random() * 48); // Approved within 2 days
    }

    await db.tenant.create({
      data: {
        name: `Seeded Restaurant ${i + 1}`,
        slug,
        status,
        createdAt: createdDate,
        approvedAt: approvedDate,
        users: {
          create: {
            name: `Owner ${i + 1}`,
            email: `owner${i + 1}-${Date.now()}@example.com`,
            role: "OWNER",
          },
        },
      },
    });
  }

  console.log(`Successfully seeded ${numRecords} owner accounts!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
