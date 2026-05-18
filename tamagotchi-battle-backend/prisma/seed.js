// Run this to create NPC Tamagotchis for AI battles

import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function getOrCreateSystemUser() {
  let systemUser = await prisma.user.findUnique({
    where: { email: "npc@tamagotchi.com" },
  });

  if (!systemUser) {
    systemUser = await prisma.user.create({
      data: {
        email: "npc@tamagotchi.com",
        password: "npc_system_bot", // This won't be used for login
      },
    });
    console.log("✅ Created system user for NPCs");
  }

  return systemUser;
}

// Define NPC Tamagotchis
const npcTamagotchis = [
  {
    name: "Wild Fire",
    type: "Fire",
    level: 3,
    xp: 200,
    hunger: 30,
    happiness: 70,
    energy: 80,
    wins: 5,
    losses: 2,
  },
  {
    name: "Aqua Spirit",
    type: "Water",
    level: 3,
    xp: 200,
    hunger: 40,
    happiness: 75,
    energy: 75,
    wins: 4,
    losses: 3,
  },
  {
    name: "Forest Guardian",
    type: "Grass",
    level: 3,
    xp: 200,
    hunger: 35,
    happiness: 80,
    energy: 70,
    wins: 6,
    losses: 1,
  },
  {
    name: "Ember Jr.",
    type: "Fire",
    level: 1,
    xp: 50,
    hunger: 50,
    happiness: 50,
    energy: 50,
    wins: 0,
    losses: 0,
  },
  {
    name: "Bubble",
    type: "Water",
    level: 1,
    xp: 50,
    hunger: 50,
    happiness: 50,
    energy: 50,
    wins: 0,
    losses: 0,
  },
  {
    name: "Sprout",
    type: "Grass",
    level: 1,
    xp: 50,
    hunger: 50,
    happiness: 50,
    energy: 50,
    wins: 0,
    losses: 0,
  },
  {
    name: "Phoenix",
    type: "Fire",
    level: 5,
    xp: 500,
    hunger: 20,
    happiness: 90,
    energy: 95,
    wins: 15,
    losses: 3,
  },
  {
    name: "Leviathan",
    type: "Water",
    level: 5,
    xp: 500,
    hunger: 25,
    happiness: 85,
    energy: 90,
    wins: 14,
    losses: 4,
  },
  {
    name: "Ent",
    type: "Grass",
    level: 5,
    xp: 500,
    hunger: 20,
    happiness: 95,
    energy: 85,
    wins: 16,
    losses: 2,
  },
];

async function main() {
  console.log("🌱 Seeding NPC Tamagotchis...");

  const systemUser = await getOrCreateSystemUser();

  let created = 0;

  for (const npc of npcTamagotchis) {
    // Check if this NPC already exists
    const existing = await prisma.tamagotchi.findFirst({
      where: {
        name: npc.name,
        isNPC: true,
      },
    });

    if (!existing) {
      await prisma.tamagotchi.create({
        data: {
          name: npc.name,
          type: npc.type,
          level: npc.level,
          xp: npc.xp,
          hunger: npc.hunger,
          happiness: npc.happiness,
          energy: npc.energy,
          wins: npc.wins,
          losses: npc.losses,
          isNPC: true,
          ownerId: systemUser.id,
        },
      });
      created++;
      console.log(`  ✓ Created NPC: ${npc.name} (Level ${npc.level})`);
    } else {
      console.log(`  ○ NPC already exists: ${npc.name}`);
    }
  }

  console.log(`\n✅ Seeding complete! Created ${created} new NPCs.`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
