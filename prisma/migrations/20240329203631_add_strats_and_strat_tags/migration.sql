-- CreateTable
CREATE TABLE "Strat" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "map" TEXT NOT NULL,
    "agent" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "miscLinks" TEXT[],
    "lineupsAndAbilityTricksAttackerSideNotes" TEXT NOT NULL,
    "lineupsAndAbilityTricksDefenderSideNotes" TEXT NOT NULL,
    "earlyRoundAttackerSideNotes" TEXT NOT NULL,
    "earlyRoundDefenderSideNotes" TEXT NOT NULL,
    "midRoundAttackerSideNotes" TEXT NOT NULL,
    "midRoundDefenderSideNotes" TEXT NOT NULL,
    "lateRoundAttackerSideNotes" TEXT NOT NULL,
    "lateRoundDefenderSideNotes" TEXT NOT NULL,

    CONSTRAINT "Strat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StratTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "StratTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StratToStratTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_StratToVod" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_StratToStratTag_AB_unique" ON "_StratToStratTag"("A", "B");

-- CreateIndex
CREATE INDEX "_StratToStratTag_B_index" ON "_StratToStratTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StratToVod_AB_unique" ON "_StratToVod"("A", "B");

-- CreateIndex
CREATE INDEX "_StratToVod_B_index" ON "_StratToVod"("B");

-- AddForeignKey
ALTER TABLE "Strat" ADD CONSTRAINT "Strat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StratToStratTag" ADD CONSTRAINT "_StratToStratTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Strat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StratToStratTag" ADD CONSTRAINT "_StratToStratTag_B_fkey" FOREIGN KEY ("B") REFERENCES "StratTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StratToVod" ADD CONSTRAINT "_StratToVod_A_fkey" FOREIGN KEY ("A") REFERENCES "Strat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StratToVod" ADD CONSTRAINT "_StratToVod_B_fkey" FOREIGN KEY ("B") REFERENCES "Vod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
