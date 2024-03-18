import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.vod.create({
    data: {
      map: "ascent",
      agent: "killjoy",
      title: "Never Gonna Give You Up",
      date: new Date(),
      rank: "Diamond 3",
      roundsWon: 13,
      roundsLost: 15,
      kills: 18,
      deaths: 21,
      assists: 6,
      valoplantLink: "https://valoplant.gg/strategy-id",
      trackerLink:
        "https://tracker.gg/valorant/match/aff15759-5c28-4ade-8f7b-93ec72d4b066",
      tags: {
        create: [
          { name: "Overheat" },
          { name: "1v1s" },
          { name: "Map awareness" },
          { name: "Game sense" },
        ],
      },
      description:
        "Good 1v1s, but overheated too often. Textbook examples of playing off contact. Map awareness sucked in the second half. Pay attention to the enemy's util usage, and reposition depending on who's where.",
      unlistedYoutubeVideoURL:
        "https://www.youtube.com/embed/dQw4w9WgXcQ?si=lQBlzJaRwljhksGZ",
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
