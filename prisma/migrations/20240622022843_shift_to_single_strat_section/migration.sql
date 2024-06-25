/*
  Warnings:

  - You are about to drop the column `earlyRoundAttackerSideNotes` on the `Strat` table. All the data in the column will be lost.
  - You are about to drop the column `earlyRoundDefenderSideNotes` on the `Strat` table. All the data in the column will be lost.
  - You are about to drop the column `lateRoundAttackerSideNotes` on the `Strat` table. All the data in the column will be lost.
  - You are about to drop the column `lateRoundDefenderSideNotes` on the `Strat` table. All the data in the column will be lost.
  - You are about to drop the column `lineupsAndAbilityTricksAttackerSideNotes` on the `Strat` table. All the data in the column will be lost.
  - You are about to drop the column `lineupsAndAbilityTricksDefenderSideNotes` on the `Strat` table. All the data in the column will be lost.
  - You are about to drop the column `midRoundAttackerSideNotes` on the `Strat` table. All the data in the column will be lost.
  - You are about to drop the column `midRoundDefenderSideNotes` on the `Strat` table. All the data in the column will be lost.
  - You are about to drop the column `miscLinks` on the `Strat` table. All the data in the column will be lost.
  - You are about to drop the column `miscNotes` on the `Strat` table. All the data in the column will be lost.
  - You are about to drop the column `stratSection` on the `StratImage` table. All the data in the column will be lost.
  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `attackerSideNotes` to the `Strat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defenderSideNotes` to the `Strat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- AlterTable
ALTER TABLE "Strat" DROP COLUMN "earlyRoundAttackerSideNotes",
DROP COLUMN "earlyRoundDefenderSideNotes",
DROP COLUMN "lateRoundAttackerSideNotes",
DROP COLUMN "lateRoundDefenderSideNotes",
DROP COLUMN "lineupsAndAbilityTricksAttackerSideNotes",
DROP COLUMN "lineupsAndAbilityTricksDefenderSideNotes",
DROP COLUMN "midRoundAttackerSideNotes",
DROP COLUMN "midRoundDefenderSideNotes",
DROP COLUMN "miscLinks",
DROP COLUMN "miscNotes",
ADD COLUMN     "attackerSideNotes" TEXT NOT NULL,
ADD COLUMN     "defenderSideNotes" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StratImage" DROP COLUMN "stratSection";

-- DropTable
DROP TABLE "Note";

-- DropEnum
DROP TYPE "StratSection";
