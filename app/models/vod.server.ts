import type { Vod } from "@prisma/client";

import { prisma } from "~/db.server";

export function getVods({
  map,
  agent,
}: {
  map: Vod["map"];
  agent: Vod["agent"];
}) {
  return prisma.vod.findMany({
    where: { deletedAt: null, map, agent },
    orderBy: { createdAt: "desc" },
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
  });
}
