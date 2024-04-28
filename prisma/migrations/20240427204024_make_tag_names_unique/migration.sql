/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `StratTag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StratTag_name_key" ON "StratTag"("name");
