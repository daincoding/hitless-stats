const dain = {
    name: "dain",
    avatar: "src/assets/avatars/waiting_dain.png",
    description: "Hitless Runner & Musician, pushing the limits in Soulsborne & beyond.",
    socials: {
      twitch: "https://twitch.tv/dain_sounds",
      youtube: "https://youtube.com/dain",
      bluesky: "https://bsky.app/dain",
      teamHitless: "https://teamhitless.com/dain",
    },
    schedule: [
      { day: "Tuesday", time: "05:30 PM", fixed: true },
      { day: "Wednesday", time: "05:30 PM", fixed: true },
      { day: "Thursday", time: "05:30 PM", fixed: true },
      { day: "Friday", time: "05:30 PM", fixed: true },
      { day: "Saturday", time: "Spontaneous", fixed: false },
      { day: "Sunday", time: "Spontaneous", fixed: false },
    ],
    currentRuns: [
      {
        id: "ds3-allbosses",
        name: "Dark Souls III All Bosses + DLC",
        type: "Single Game",
        startDate: "2025-01-05",
        description: "Dark Souls III All Bosses + DLC means that we beat every boss in Dark Souls III including all DLCs: Ashes of Ariandel and The Ringed City.",
        badges: ["Any%", "All Basegame Bosses", "DLC"],
        status: "Dead",
        worldRecord: false,
        distancePB: { split: "Geil", reachedSplits: 30, totalSplits: 31 },
        splits: [
          "Gunni", "Highwall", "w0rd", "Running in the 90s", "Sage Ich Nicht", "Winter Wonderland", 
          "Uhh Watcha Say", "The Fog", "Dance Dance", "Morning Shopping Gang", "Enormo", "One Shot", 
          "Freak", "DSA", "The Musicians", "TreeBalls", "Be A Man!", "Down Down Down", "OTK", "Mc Swoozie", 
          "ParryGod", "Headjump", "Nameless", "FARMING", "Carnivora", "Prayge", "JainTheSounds", 
          "The Last Run", "Dankeater Midir", "Chillout", "Geil"
        ],
        completedSplits: 16,
        failedSplit: "Be A Man!",
        pastRuns: [
            { runId: 15, completedSplits: 22, failedSplit: "Nameless" },
            { runId: 14, completedSplits: 9, failedSplit: "Morning Shopping Gang" },
            { runId: 13, completedSplits: 4, failedSplit: "Sage Ich Nicht" },
            { runId: 12, completedSplits: 18, failedSplit: "OTK" },
            { runId: 11, completedSplits: 21, failedSplit: "Headjump" },
            { runId: 10, completedSplits: 8, failedSplit: "Dance Dance" },
            { runId: 9, completedSplits: 12, failedSplit: "Freak" },
            { runId: 8, completedSplits: 23, failedSplit: "FARMING" },
            { runId: 7, completedSplits: 7, failedSplit: "The Fog" },
            { runId: 6, completedSplits: 6, failedSplit: "Uhh Watcha Say" },
            { runId: 5, completedSplits: 14, failedSplit: "The Musicians" },
            { runId: 4, completedSplits: 15, failedSplit: "TreeBalls" },
            { runId: 3, completedSplits: 2, failedSplit: "w0rd" },
            { runId: 2, completedSplits: 30, failedSplit: "Geil" },
            { runId: 1, completedSplits: 1, failedSplit: "Highwall" },
        ]
      },
      {
        id: "bloodborne-any%",
        name: "Bloodborne Any%",
        type: "Single Game",
        startDate: "2025-01-03",
        description: "Bloodborne Any% unrestricted run",
        badges: ["Any%, Unrestricted"],
        status: "Alive",
        worldRecord: true,
        distancePB: "-", // No data yet
        splits: [
          "Start", "Hunter 1", "Osnabrueck", "BSB", "Amelia", "Forst", "Shadows",
          "Rave", "Reborn", "Mico", "Nurse"
        ],
        completedSplits: 4, // No previous runs
        failedSplit: "-", // No failures yet
        pastRuns: []
      },
      {
        id: "ds-trilogy",
        name: "Dark Souls Trilogy",
        type: "Marathon",
        startDate: "2024-11-10",
        description: "Beating Dark Souls I, Dark Souls II, and Dark Souls III back-to-back without getting hit. The game order does not matter.",
        badges: ["Any%", "Dark Souls I", "Dark Souls II", "Dark Souls III"],
        status: "Dead",
        worldRecord: false,
        distancePB: { game: "Game 2", split: "13" }, // Last reached split
        currentOrder: ["Dark Souls I", "Dark Souls II", "Dark Souls III"], // Current run order
        games: [
          {
            name: "Dark Souls III",
            splits: ["Reset", "HighWall", "Vordt", "Undead Swamp", "Crystal Sage", "Uhh Watcha Saaaay",
                     "Wolnir", "Dance Dance", "Morning Shopping Gang", "Enormo", "One Shot - One Opportunity",
                     "The Freak", "DSA", "The Last Run", "The Musicians", "Cinder"],
          },
          {
            name: "Dark Souls II",
            splits: ["Poolparty", "Stamp On The Ground", "Aimbot", "I will walk 500 Miles", "Rot Rot",
                     "Shulva Schmulva", "Ten Ten", "Castlevenia", "Dragonriders", "Mirror Knight",
                     "AMana Koikarpfen", "Ribbert", "Dink Donk", "Dragon Deez", "Edammer", "Watch Nashi"],
          },
          {
            name: "Dark Souls I",
            splits: ["Alcatraz", "RTSR", "Booba Cheese", "Garg Cheese", "Spreading Dainrot",
                     "Anor Londo", "Terence & Bud", "Catacombs", "Pinni", "Overcome Dainrot", "Nito",
                     "Seath", "Puppery", "Kingsfield", "Bedge", "Gwyn"],
          },
        ],
        completedSplits: { "Dark Souls I": 16, "Dark Souls II": 11, "Dark Souls III": 0 },
        failedSplit: { game: "Dark Souls II", split: "Ribbert" }, // Where the run ended
        pastRuns: [
          { runId: 5, order: ["Dark Souls II", "Dark Souls I", "Dark Souls III"], completedSplits: { "Dark Souls II": 16, "Dark Souls I": 3, "Dark Souls III": 0 }, failedGame: "Dark Souls I", failedSplit: "Garg Cheese" },
          { runId: 4, order: ["Dark Souls I", "Dark Souls II", "Dark Souls III"], completedSplits: { "Dark Souls I": 16, "Dark Souls II": 12, "Dark Souls III": 0 }, failedGame: "Dark Souls II", failedSplit: "Ribbert" },
          { runId: 3, order: ["Dark Souls I", "Dark Souls II", "Dark Souls III"], completedSplits: { "Dark Souls I": 16, "Dark Souls II": 12, "Dark Souls III": 0 }, failedGame: "Dark Souls II", failedSplit: "Ribbert" },
          { runId: 2, order: ["Dark Souls II", "Dark Souls III", "Dark Souls I"], completedSplits: { "Dark Souls II": 16, "Dark Souls III": 7, "Dark Souls I": 0 }, failedGame: "Dark Souls III", failedSplit: "Dance Dance" },
          { runId: 1, order: ["Dark Souls III", "Dark Souls II", "Dark Souls I"], completedSplits: { "Dark Souls III": 4, "Dark Souls II": 0, "Dark Souls I": 0 }, failedGame: "Dark Souls III", failedSplit: "Crystal Sage" },
        ]
      },
      {
        id: "fs-skillogy",
        name: "Bloodborne Sekiro Elden Ring Trilogy",
        type: "Marathon",
        startDate: "2024-11-10",
        description: "Beating Sekiro, Bloodborne, and Elden Ring back-to-back without getting hit. The game order does not matter.",
        badges: ["Any%", "Sekiro", "Bloodborne", "Elden Ring"],
        status: "Dead",
        worldRecord: true,
        distancePB: { game: "Game 2", split: "10" }, // Last reached split
        currentOrder: ["Elden Ring", "Sekiro", "Bloodborne"], // Current run order
        games: [
          {
            name: "Bloodborne",
            splits: ["Reset", "Papa G", "Osnabrueck", "BSB", "HappyFeet", "Forest",
                     "Nazgul", "Reborn", "Mico", "Nurse"],
          },
          {
            name: "Sekiro",
            splits: ["Geni", "Oger", "Horse", "Bull", "Geni2",
                     "Roberto", "Monkey", "Gunfort", "Giraffe", "Sneke",
                     "Apes", "Isshin"],
          },
          {
            name: "Elden Ring",
            splits: ["Alcatraz", "RTSR", "Booba Cheese", "Garg Cheese", "Spreading Dainrot",
                     "Anor Londo", "Terence & Bud", "Catacombs", "Pinni", "Overcome Dainrot", "Nito",
                     "Seath", "Puppery", "Kingsfield", "Bedge", "Gwyn"],
          },
        ],
        completedSplits: { "Elden Ring": 16, "Sekiro": 11, "Bloodborne": 0 },
        failedSplit: { game: "Sekiro", split: "Apes" }, // Where the run ended
        pastRuns: [
          { runId: 5, order: ["Sekiro", "Elden Ring", "Bloodborne"], completedSplits: { "Sekiro": 12, "Elden Ring": 3, "Bloodborne": 0 }, failedGame: "Elden Ring", failedSplit: "Garg Cheese" },
          { runId: 4, order: ["Elden Ring", "Sekiro", "Bloodborne"], completedSplits: { "Elden Ring": 16, "Sekiro": 5, "Bloodborne": 0 }, failedGame: "Sekiro", failedSplit: "Roberto" },
          { runId: 3, order: ["Elden Ring", "Sekiro", "Bloodborne"], completedSplits: { "Elden Ring": 16, "Sekiro": 5, "Bloodborne": 0 }, failedGame: "Sekiro", failedSplit: "Roberto" },
          { runId: 2, order: ["Sekiro", "Bloodborne", "Elden Ring"], completedSplits: { "Sekiro": 16, "Bloodborne": 1, "Elden Ring": 0 }, failedGame: "Bloodborne", failedSplit: "Papa G" },
          { runId: 1, order: ["Bloodborne", "Sekiro", "Elden Ring"], completedSplits: { "Bloodborne": 8, "Sekiro": 0, "Elden Ring": 0 }, failedGame: "Bloodborne", failedSplit: "Mico" },
        ]
      }
    ],
  };
  
export default dain;