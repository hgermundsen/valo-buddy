import { Strat, StratTag, User } from "@prisma/client";

import { prisma } from "~/db.server";

// Only supports querying by title.
//
// Only fetches information about each strat necessary for displaying in a list
// of them.
export function getStratListItems({
  userId,
  map,
  agent,
  query,
  tagIds,
}: {
  userId: User["id"];
  map: Strat["map"];
  agent: Strat["agent"];
  query?: string;
  tagIds: StratTag["id"][];
}) {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereAnd: any = [];
    tagIds.forEach((tagId) => {
      whereAnd.push({ tags: { some: { id: tagId } } });
    });
    where.AND = whereAnd;
  }

  return prisma.strat.findMany({
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      title: true,
      tags: { select: { id: true, name: true } },
      images: true,
    },
    where,
    orderBy: { updatedAt: "desc" },
  });
}

export function getStrat({
  id,
  userId,
}: Pick<Strat, "id"> & { userId: User["id"] }) {
  return prisma.strat.findFirst({
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
      miscNotes: true,
      relatedVods: { select: { id: true, title: true } },
      images: { select: { id: true, stratSection: true, imageURL: true } },
    },
    where: {
      id,
      // Without this check, we have an IDOR. With this check, if a match
      // doesn't exist, then we return "no results", which is exactly the type
      // of obscure response we want to send back to the client.
      userId,
    },
  });
}
