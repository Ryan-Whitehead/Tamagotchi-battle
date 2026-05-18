-- CreateTable
CREATE TABLE "BattleSession" (
    "id" TEXT NOT NULL,
    "playerId" INTEGER NOT NULL,
    "npcId" INTEGER NOT NULL,
    "playerHP" INTEGER NOT NULL DEFAULT 100,
    "npcHP" INTEGER NOT NULL DEFAULT 100,
    "round" INTEGER NOT NULL DEFAULT 1,
    "playerDefense" BOOLEAN NOT NULL DEFAULT false,
    "npcDefense" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BattleSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BattleSession" ADD CONSTRAINT "BattleSession_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Tamagotchi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleSession" ADD CONSTRAINT "BattleSession_npcId_fkey" FOREIGN KEY ("npcId") REFERENCES "Tamagotchi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
