/*
  Warnings:

  - Added the required column `agent` to the `Vod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `map` to the `Vod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vod" ADD COLUMN     "agent" TEXT NOT NULL,
ADD COLUMN     "map" TEXT NOT NULL;
