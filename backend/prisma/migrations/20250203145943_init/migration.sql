-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "twitch" TEXT NOT NULL,
    "youtube" TEXT NOT NULL,
    "bluesky" TEXT NOT NULL,
    "teamHitless" TEXT NOT NULL,
    "completedRuns" INTEGER NOT NULL,
    "completedMarathons" INTEGER NOT NULL,
    "schedule" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "Run" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "badges" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "worldRecord" BOOLEAN NOT NULL,
    "distancePB" JSONB,
    "splits" JSONB NOT NULL,
    "completedSplits" INTEGER,
    "failedSplit" TEXT,
    "pastRuns" JSONB NOT NULL,
    CONSTRAINT "Run_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PastRun" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "youtube" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "game" TEXT,
    "games" JSONB NOT NULL,
    "badges" JSONB NOT NULL,
    CONSTRAINT "PastRun_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Guide" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "youtube" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "badges" JSONB NOT NULL,
    CONSTRAINT "Guide_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");
