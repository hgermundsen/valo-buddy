/*
  Warnings:

  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TagToVod` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TagToVod" DROP CONSTRAINT "_TagToVod_A_fkey";

-- DropForeignKey
ALTER TABLE "_TagToVod" DROP CONSTRAINT "_TagToVod_B_fkey";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_TagToVod";

-- CreateTable
CREATE TABLE "VodTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "VodTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VodToVodTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_VodToVodTag_AB_unique" ON "_VodToVodTag"("A", "B");

-- CreateIndex
CREATE INDEX "_VodToVodTag_B_index" ON "_VodToVodTag"("B");

-- AddForeignKey
ALTER TABLE "_VodToVodTag" ADD CONSTRAINT "_VodToVodTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Vod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VodToVodTag" ADD CONSTRAINT "_VodToVodTag_B_fkey" FOREIGN KEY ("B") REFERENCES "VodTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
