import type { Vod } from "@prisma/client";

import { prisma } from "~/db.server";

export function getVods({
  userId,
  map,
  agent,
  query,
  tagIds,
}: {
  userId: Vod["userId"];
  map: Vod["map"];
  agent: Vod["agent"];
  query?: string;
  tagIds: string[];
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    userId,
    deletedAt: null,
    map,
    agent,
  };

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
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

  return prisma.vod.findMany({
    select: {
      id: true,
      title: true,
      date: true,
      rank: true,
      roundsWon: true,
      roundsLost: true,
      kills: true,
      deaths: true,
      assists: true,
      valoplantLink: true,
      trackerLink: true,
      tags: { select: { id: true, name: true } },
      description: true,
      unlistedYoutubeVideoURL: true,
    },
    where,
    orderBy: { updatedAt: "desc" },
  });
}
