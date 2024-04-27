import { Strat, StratTag, User } from "@prisma/client";

import { prisma } from "~/db.server";

import { replaceEmptyStringsWithNull } from "./utils.server";

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

// TODO: Currently assumes whoever called this owns the strat being updated.
// Validate this?
export function getStratTitle(id: Strat["id"]) {
  return prisma.strat.findFirst({
    where: { id },
    select: { title: true },
  });
}

export function doesStratBelongToUser({
  id,
  userId,
}: Pick<Strat, "id"> & { userId: User["id"] }) {
  // TODO: Is there a way to do this without sending any data from this strat
  // across the wire from the database to the server? Looking for the cheapest
  // possible way to get a yes-or-no answer.
  return prisma.strat.findFirstOrThrow({
    select: { id: true },
    where: { id, userId },
  });
}

// TODO: Currently assumes whoever called this owns the strat being updated.
// Validate this?
export function updateStrat(id: Strat["id"], fields: Partial<Strat>) {
  const preprocessedFields = replaceEmptyStringsWithNull(fields);
  // https://stackoverflow.com/a/69529379
  return prisma.strat.update({
    where: { id },
    data: { ...preprocessedFields },
  });
}

// TODO: Currently assumes whoever called this owns the strat being updated.
// Validate this?
export function createNewTagAndAddItToStrat(
  id: Strat["id"],
  tagName: StratTag["name"],
) {
  return prisma.strat.update({
    where: { id },
    data: {
      tags: {
        create: {
          name: tagName,
        },
      },
    },
  });
}

// TODO: Currently assumes whoever called this owns the strat being updated.
// Validate this?
//
// TODO: What will happen if the provided tagId doesn't exist? What kind of
// error/exception will Prisma return? Figure this out so we can handle that
// wherever this is called. What happens if the tag is already attached to the
// strat?
export function addExistingTagToStrat(id: Strat["id"], tagId: StratTag["id"]) {
  return prisma.strat.update({
    where: { id },
    data: { tags: { connect: { id: tagId } } },
  });
}

// TODO: Currently assumes whoever called this owns the strat being updated.
// Validate this?
//
// TODO: What will happen if the provided tagId doesn't exist? What kind of
// error/exception will Prisma return? Figure this out so we can handle that
// wherever this is called. What happens if the tag isn't attached the strat?
export function removeTagFromStrat(
  tagId: StratTag["id"],
  stratId: Strat["id"],
) {
  return prisma.strat.update({
    where: { id: stratId },
    data: { tags: { disconnect: { id: tagId } } },
  });
}

export function createStrat(
  userId: User["id"],
  map: Strat["map"],
  agent: Strat["agent"],
  title: Strat["title"],
  fields: Partial<Strat>,
) {
  // TODO: Is this necessary for this create func?
  const preprocessedFields = replaceEmptyStringsWithNull(fields);
  // https://stackoverflow.com/a/69529379
  return prisma.strat.create({
    data: {
      user: { connect: { id: userId } },
      map,
      agent,
      title,
      ...preprocessedFields,
    },
  });
}

export function deleteStrat(id: Strat["id"], userId: User["id"]) {
  // Without the userId check, we have an IDOR vulnerability.
  //
  // There will only ever be one record which satisfies these WHERE clauses, but
  // Prisma doesn't let us include the userId in that block since they aren't
  // unique on strats (makes sense, but is still a bit frustrating).
  return prisma.strat.deleteMany({ where: { id, userId } });
}

export interface StratTagListItem {
  id: string;
  name: string;
}
// Only fetches information about each tag necessary for displaying in a list of
// them.
export async function getAllStratTags(
  userId: User["id"],
  map: Strat["map"],
  agent: Strat["agent"],
): Promise<StratTagListItem[]> {
  const allStratTags = await prisma.strat.findMany({
    where: { userId, map, agent },
    select: { tags: { select: { id: true, name: true } } },
  });

  const uniqueTagIds = new Set();
  const uniqueTags: StratTagListItem[] = [];
  allStratTags.forEach((tagsList) => {
    tagsList.tags.forEach((tag) => {
      if (!uniqueTagIds.has(tag.id)) {
        uniqueTags.push({ ...tag });
        uniqueTagIds.add(tag.id);
      }
    });
  });

  return uniqueTags;
}

export async function getTagsForStrat(id: Strat["id"], userId: User["id"]) {
  return prisma.strat.findFirstOrThrow({
    where: { userId, id },
    select: { tags: { select: { id: true, name: true } } },
  });
}
