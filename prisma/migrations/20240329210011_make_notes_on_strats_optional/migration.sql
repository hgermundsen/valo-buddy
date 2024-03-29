-- AlterTable
ALTER TABLE "Strat" ALTER COLUMN "lineupsAndAbilityTricksAttackerSideNotes" DROP NOT NULL,
ALTER COLUMN "lineupsAndAbilityTricksDefenderSideNotes" DROP NOT NULL,
ALTER COLUMN "earlyRoundAttackerSideNotes" DROP NOT NULL,
ALTER COLUMN "earlyRoundDefenderSideNotes" DROP NOT NULL,
ALTER COLUMN "midRoundAttackerSideNotes" DROP NOT NULL,
ALTER COLUMN "midRoundDefenderSideNotes" DROP NOT NULL,
ALTER COLUMN "lateRoundAttackerSideNotes" DROP NOT NULL,
ALTER COLUMN "lateRoundDefenderSideNotes" DROP NOT NULL;
