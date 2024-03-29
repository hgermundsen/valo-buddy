import { Strat } from "@prisma/client";

import { prisma } from "~/db.server";

export function getStrats(
  userId: Strat["userId"],
  map: Strat["map"],
  agent: Strat["agent"],
  tagIds: string[],
  query?: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    userId,
    deletedAt: null,
    map,
    agent,
  };

  if (query) {
    where.title = { contains: query, mode: "insensitive" };
  }
  if (tagIds.length > 0) {
    where.tags = {
      some: {
        id: {
          in: tagIds,
        },
      },
    };
  }

  return prisma.strat.findMany({
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      title: true,
      tags: { select: { id: true, name: true } },
      miscLinks: true,
      lineupsAndAbilityTricksAttackerSideNotes: true,
      lineupsAndAbilityTricksDefenderSideNotes: true,
      earlyRoundAttackerSideNotes: true,
      earlyRoundDefenderSideNotes: true,
      midRoundAttackerSideNotes: true,
      midRoundDefenderSideNotes: true,
      lateRoundAttackerSideNotes: true,
      lateRoundDefenderSideNotes: true,
      relatedVods: { select: { id: true, title: true } },
    },
    where,
    orderBy: { createdAt: "desc" },
  });
}
