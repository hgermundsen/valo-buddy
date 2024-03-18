-- CreateTable
CREATE TABLE "Vod" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "rank" TEXT NOT NULL,
    "roundsWon" SMALLINT NOT NULL,
    "roundsLost" SMALLINT NOT NULL,
    "kills" SMALLINT NOT NULL,
    "deaths" SMALLINT NOT NULL,
    "assists" SMALLINT NOT NULL,
    "valoplantLink" TEXT NOT NULL,
    "trackerLink" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unlistedYoutubeVideoURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Vod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TagToVod" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TagToVod_AB_unique" ON "_TagToVod"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToVod_B_index" ON "_TagToVod"("B");

-- AddForeignKey
ALTER TABLE "_TagToVod" ADD CONSTRAINT "_TagToVod_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToVod" ADD CONSTRAINT "_TagToVod_B_fkey" FOREIGN KEY ("B") REFERENCES "Vod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
