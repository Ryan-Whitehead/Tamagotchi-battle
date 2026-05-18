/*
  Warnings:

  - You are about to drop the `Battle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Battle" DROP CONSTRAINT "Battle_loserId_fkey";

-- DropForeignKey
ALTER TABLE "Battle" DROP CONSTRAINT "Battle_winnerId_fkey";

-- AlterTable
ALTER TABLE "Tamagotchi" ADD COLUMN     "isNPC" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "name" SET DEFAULT 'Tamagotchi';

-- DropTable
DROP TABLE "Battle";
