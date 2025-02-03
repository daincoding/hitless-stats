const jthehelmet = {
  name: "JtheHelmet",
  avatar: "src/assets/avatars/jthehelmet.png",
  description: "Dedicated NoHit runner, pushing the limits in Soulsborne & beyond.",
  socials: {
    twitch: "https://twitch.tv/jthehelmet",
    youtube: "https://youtube.com/jthehelmet",
    bluesky: "https://bsky.app/jthehelmet",
    teamHitless: "https://teamhitless.com/jthehelmet",
  },
  completedRuns: 12,
  completedMarathons: 2,
  schedule: [
    { day: "Monday", time: "06:00 PM", fixed: true },
    { day: "Wednesday", time: "07:30 PM", fixed: true },
    { day: "Friday", time: "08:00 PM", fixed: true },
    { day: "Saturday", time: "Spontaneous", fixed: false },
    { day: "Sunday", time: "Spontaneous", fixed: false },
  ],
  currentRuns: [
    {
      id: "elden-ring-allbosses",
      name: "Elden Ring All Bosses",
      type: "Single Game",
      startDate: "2025-02-01",
      description: "Defeating every boss in Elden Ring without taking a hit.",
      badges: ["Any%", "All Bosses", "Unrestricted"],
      status: "Alive",
      worldRecord: false,
      distancePB: { split: "Godfrey, First Lord", reachedSplits: 22, totalSplits: 35 },
      splits: [
        "Soldier", "Tree Sentinel", "Margit", "Godrick", "Radagon", "Academy Entrance", 
        "Rennala", "Rykard", "Morgott", "Fire Giant", "Godskin Duo", "Maliketh", 
        "Sir Gideon", "Godfrey, First Lord", "Radagon", "Elden Beast"
      ],
      completedSplits: 14,
      failedSplit: "Godskin Duo",
      pastRuns: [
          { runId: 15, completedSplits: 23, failedSplit: "Radagon" },
          { runId: 14, completedSplits: 21, failedSplit: "Sir Gideon" },
          { runId: 13, completedSplits: 19, failedSplit: "Godfrey, First Lord" },
          { runId: 12, completedSplits: 16, failedSplit: "Fire Giant" },
          { runId: 11, completedSplits: 13, failedSplit: "Morgott" },
          { runId: 10, completedSplits: 17, failedSplit: "Maliketh" },
          { runId: 9, completedSplits: 12, failedSplit: "Morgott" },
          { runId: 8, completedSplits: 5, failedSplit: "Godrick" },
          { runId: 7, completedSplits: 20, failedSplit: "Radagon" },
      ]
    },
    {
      id: "nohit-pentathlon",
      name: "NoHit Pentathlon",
      type: "Marathon",
      startDate: "2024-11-15",
      description: "A NoHit challenge completing 5 games back-to-back without taking a hit.",
      badges: ["Any%", "Elden Ring", "Sekiro", "Dark Souls III", "Bloodborne", "Demon's Souls"],
      status: "Dead",
      worldRecord: false,
      distancePB: { game: "Game 3", split: "Gwyn" }, 
      currentOrder: ["Elden Ring", "Sekiro", "Dark Souls III", "Bloodborne", "Demon's Souls"], 
      games: [
        {
          name: "Elden Ring",
          splits: ["Tree Sentinel", "Margit", "Godrick", "Radagon", "Rennala", "Fire Giant", "Elden Beast"],
        },
        {
          name: "Sekiro",
          splits: ["Geni", "Ogre", "Horse", "Bull", "Geni2", "Monk", "Isshin"],
        },
        {
          name: "Dark Souls III",
          splits: ["Gundyr", "Vordt", "Abyss Watchers", "Aldrich", "Dancer", "Princes", "Cinder"],
        },
        {
          name: "Bloodborne",
          splits: ["Papa G", "BSB", "Shadows", "Rom", "Micolash", "Gherman", "Moon Presence"],
        },
        {
          name: "Demon's Souls",
          splits: ["Phalanx", "Tower Knight", "Penetrator", "Storm King", "False King Allant"],
        }
      ],
      completedSplits: { "Elden Ring": 16, "Sekiro": 11, "Dark Souls III": 5, "Bloodborne": 2, "Demon's Souls": 0 },
      failedSplit: { game: "Dark Souls III", split: "Cinder" }, 
      pastRuns: [
        { runId: 10, order: ["Bloodborne", "Elden Ring", "Sekiro", "Demon's Souls", "Dark Souls III"], completedSplits: { "Bloodborne": 14, "Elden Ring": 10, "Sekiro": 8, "Demon's Souls": 2, "Dark Souls III": 0 }, failedGame: "Dark Souls III", failedSplit: "Gundyr" },
        { runId: 9, order: ["Sekiro", "Elden Ring", "Bloodborne", "Dark Souls III", "Demon's Souls"], completedSplits: { "Sekiro": 16, "Elden Ring": 14, "Bloodborne": 8, "Dark Souls III": 0, "Demon's Souls": 0 }, failedGame: "Dark Souls III", failedSplit: "Abyss Watchers" },
        { runId: 8, order: ["Elden Ring", "Sekiro", "Dark Souls III", "Bloodborne", "Demon's Souls"], completedSplits: { "Elden Ring": 16, "Sekiro": 11, "Dark Souls III": 5, "Bloodborne": 2, "Demon's Souls": 0 }, failedGame: "Demon's Souls", failedSplit: "Tower Knight" },
        { runId: 7, order: ["Demon's Souls", "Sekiro", "Dark Souls III", "Elden Ring", "Bloodborne"], completedSplits: { "Demon's Souls": 10, "Sekiro": 5, "Dark Souls III": 4, "Elden Ring": 1, "Bloodborne": 0 }, failedGame: "Bloodborne", failedSplit: "Papa G" },
        { runId: 6, order: ["Sekiro", "Dark Souls III", "Elden Ring", "Bloodborne", "Demon's Souls"], completedSplits: { "Sekiro": 16, "Dark Souls III": 12, "Elden Ring": 3, "Bloodborne": 1, "Demon's Souls": 0 }, failedGame: "Demon's Souls", failedSplit: "Penetrator" },
        { runId: 5, order: ["Elden Ring", "Dark Souls III", "Sekiro", "Bloodborne", "Demon's Souls"], completedSplits: { "Elden Ring": 16, "Dark Souls III": 12, "Sekiro": 7, "Bloodborne": 0, "Demon's Souls": 0 }, failedGame: "Bloodborne", failedSplit: "Rom" }
      ]
    }
  ]
};

export default jthehelmet;
