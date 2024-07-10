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
    OR: [
      { map, agent },
      { map: "all-maps", agent },
      { map, agent: "all-agents" },
      { map: "all-maps", agent: "all-agents" },
    ],
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
      stratImageUrls: true,
      numImages: true,
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
      attackerSideNotes: true,
      defenderSideNotes: true,
      relatedVods: { select: { id: true, title: true } },
      stratImageUrls: true,
      numImages: true,
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
  userId: User["id"],
) {
  return prisma.strat.update({
    where: { id },
    data: {
      tags: {
        create: {
          name: tagName,
          userId,
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
      attackerSideNotes: "",
      defenderSideNotes: "",
      ...preprocessedFields,
    },
  });
}

export function createEmptyStrat(
  map: Strat["map"],
  agent: Strat["agent"],
  userId: User["id"],
) {
  const template = `# Lineups and Ability Tricks
## Subsection here
### Sub-subsection here
This is where you'd put actual strategy information. For now we fully support markdown for formatting and you can find more info in this [Cheat Sheet](https://www.markdownguide.org/cheat-sheet/) if you're unfamiliar.

1. An ordered list
2. With multiple entries
3. Like this

* And an unordered list
  * With nested parts
* Like this

Images can be embedded like this: ![](https://media.tenor.com/A79jOIxgqUYAAAAi/surprised-penguin-valorant.gif)

---

# Early Round
## Subsection here
### Sub-subsection here
This is where you'd put actual strategy information. For now we fully support markdown for formatting and you can find more info in this [Cheat Sheet](https://www.markdownguide.org/cheat-sheet/) if you're unfamiliar.

1. An ordered list
2. With multiple entries
3. Like this

* And an unordered list
  * With nested parts
* Like this

Images can be embedded like this: ![](https://media.tenor.com/A79jOIxgqUYAAAAi/surprised-penguin-valorant.gif)

---

# Mid Round
## Subsection here
### Sub-subsection here
This is where you'd put actual strategy information. For now we fully support markdown for formatting and you can find more info in this [Cheat Sheet](https://www.markdownguide.org/cheat-sheet/) if you're unfamiliar

1. An ordered list
2. With multiple entries
3. Like this

* And an unordered list
  * With nested parts
* Like this

Images can be embedded like this: ![](https://media.tenor.com/A79jOIxgqUYAAAAi/surprised-penguin-valorant.gif)`;
  return prisma.strat.create({
    data: {
      user: { connect: { id: userId } },
      map,
      agent,
      title: "",
      attackerSideNotes: template,
      defenderSideNotes: template,
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
): Promise<StratTagListItem[]> {
  return prisma.stratTag.findMany({
    where: { userId },
    select: { id: true, name: true },
  });
}

export async function getTagsForStrat(id: Strat["id"], userId: User["id"]) {
  return prisma.strat.findFirstOrThrow({
    where: { userId, id },
    select: { tags: { select: { id: true, name: true } } },
  });
}
