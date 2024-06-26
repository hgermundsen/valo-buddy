/*
  Warnings:

  - You are about to drop the `StratImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StratImage" DROP CONSTRAINT "StratImage_stratId_fkey";

-- AlterTable
ALTER TABLE "Strat" ADD COLUMN     "images" TEXT[],
ADD COLUMN     "numImages" SMALLINT NOT NULL DEFAULT 0,
ADD COLUMN     "stratImageUrls" TEXT[];

-- DropTable
DROP TABLE "StratImage";
