import { PrismaClient, StratSection } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "todd@bethesda.net";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const bcryptRoundsEnvVar = parseInt(process.env.BCRYPT_ROUNDS || "");
  const bcryptRounds = Number.isInteger(bcryptRoundsEnvVar)
    ? bcryptRoundsEnvVar
    : 12;

  const hashedPassword = await bcrypt.hash("skyrimcashcow", bcryptRounds);

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
      userId: user.id,
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

  await prisma.vod.create({
    data: {
      userId: user.id,
      map: "ascent",
      agent: "killjoy",
      title: "VOD Title 2",
      date: new Date(),
      rank: "Diamond 2",
      roundsWon: 13,
      roundsLost: 6,
      kills: 12,
      deaths: 14,
      assists: 11,
      valoplantLink: "https://valoplant.gg/strategy-id",
      trackerLink:
        "https://tracker.gg/valorant/match/09131180-fdc6-4254-9b37-9d00bfd25e7e",
      tags: {
        create: [{ name: "Tag One" }, { name: "Tag Five" }],
      },
      description:
        "Got carried ngl but got mine most of the time. Quickly recognized what my job and my place were on our team, and didn't overstep.",
      unlistedYoutubeVideoURL:
        "https://www.youtube.com/embed/zf3ETYZl6So?si=u-5MXQPs_wpobi3a",
    },
  });

  const vod3 = await prisma.vod.create({
    data: {
      userId: user.id,
      map: "ascent",
      agent: "killjoy",
      title: "VOD Title 3",
      date: new Date(),
      rank: "Diamond 3",
      roundsWon: 13,
      roundsLost: 4,
      kills: 21,
      deaths: 9,
      assists: 4,
      valoplantLink: "https://valoplant.gg/strategy-id",
      trackerLink:
        "https://tracker.gg/valorant/match/aff15759-5c28-4ade-8f7b-93ec72d4b066",
      tags: {
        create: { name: "Tag Two" },
      },
      description:
        "Textbook examples of playing an entry fragger, really demonstrated the fundamentals well. Had good comms re. shot calling and early-round IGLing. We played numbers advantage well.",
      unlistedYoutubeVideoURL:
        "https://www.youtube.com/embed/Yg1cviz76dk?si=13sm8KN6udCUsy-9",
    },
  });

  await prisma.strat.create({
    data: {
      userId: user.id,
      map: "ascent",
      agent: "killjoy",
      title: "Strat 1",
      tags: {
        create: [
          {
            name: "Passive",
          },
          {
            name: "Woohoojin",
          },
        ],
      },
      lineupsAndAbilityTricksDefenderSideNotes:
        "This section doesn't just have to be for lineups. There are some neat places you can throw Reyna's eye, or ways you can toss Phoenix's flash, for instance. Those aren't lineups, but users will want a place to document stuff like that.",
      earlyRoundAttackerSideNotes:
        "- Where do high-rank/pro players start when the barriers drop?\n- What do high-rank/pro players do in the first 5-10 seconds of the round?",
      earlyRoundDefenderSideNotes:
        "- Where do high-rank/pro players start when the barriers drop?\n- What do high-rank/pro players do in the first 5-10 seconds of the round?",
      midRoundDefenderSideNotes:
        "You can add whatever you want here. TODO: Would like to see Markdown support.",
      lateRoundDefenderSideNotes:
        "TODO: Would also like to see image/screenshot upload support (potentially a security vulnerability? potentially a legal liability, since now we host content like a social network?).",
      miscNotes:
        "A place at the bottom of the page for whatever the user wants. They can summarize key points to remember, add additional info, whatever.",
      relatedVods: {
        connect: { id: vod3.id },
      },
      images: {
        create: {
          imageURL: "https://imgur.com/sSOFMDa",
          stratSection: StratSection.LINEUPS_AND_ABILITY_TRICKS_ATTACKER_SIDE,
        },
      },
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
