import type { Vod } from "@prisma/client";

import { prisma } from "~/db.server";

export function getVods({
  userId,
  map,
  agent,
  query,
}: {
  userId: Vod["userId"];
  map: Vod["map"];
  agent: Vod["agent"];
  // Can't use ? optional syntax here since this function is designed to accept
  // a query param string straight from URL.searchParams(), which returns null
  // if the param doesn't exist.
  query: string | null;
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

  return prisma.vod.findMany({
    select: {
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
      tags: true,
      description: true,
      unlistedYoutubeVideoURL: true,
    },
    where,
    orderBy: { createdAt: "desc" },
  });
}
