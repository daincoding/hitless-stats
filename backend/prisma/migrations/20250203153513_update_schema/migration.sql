/*
  Warnings:

  - The primary key for the `Guide` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PastRun` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Player` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bluesky` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `teamHitless` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `twitch` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `youtube` on the `Player` table. All the data in the column will be lost.
  - The primary key for the `Run` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `failedSplit` on the `Run` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `startDate` on the `Run` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - Added the required column `socials` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Made the column `distancePB` on table `Run` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "youtube" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "badges" JSONB NOT NULL,
    CONSTRAINT "Guide_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Guide" ("badges", "id", "name", "playerId", "thumbnail", "youtube") SELECT "badges", "id", "name", "playerId", "thumbnail", "youtube" FROM "Guide";
DROP TABLE "Guide";
ALTER TABLE "new_Guide" RENAME TO "Guide";
CREATE TABLE "new_PastRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "youtube" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "game" TEXT,
    "games" JSONB,
    "badges" JSONB NOT NULL,
    CONSTRAINT "PastRun_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PastRun" ("badges", "game", "games", "id", "name", "playerId", "thumbnail", "type", "youtube") SELECT "badges", "game", "games", "id", "name", "playerId", "thumbnail", "type", "youtube" FROM "PastRun";
DROP TABLE "PastRun";
ALTER TABLE "new_PastRun" RENAME TO "PastRun";
CREATE TABLE "new_Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "socials" JSONB NOT NULL,
    "completedRuns" INTEGER NOT NULL,
    "completedMarathons" INTEGER NOT NULL,
    "schedule" JSONB NOT NULL
);
INSERT INTO "new_Player" ("avatar", "completedMarathons", "completedRuns", "description", "id", "name", "schedule") SELECT "avatar", "completedMarathons", "completedRuns", "description", "id", "name", "schedule" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");
CREATE TABLE "new_Run" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "badges" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "worldRecord" BOOLEAN NOT NULL,
    "distancePB" JSONB NOT NULL,
    "splits" JSONB NOT NULL,
    "completedSplits" INTEGER,
    "failedSplit" JSONB,
    "pastRuns" JSONB,
    CONSTRAINT "Run_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Run" ("badges", "completedSplits", "description", "distancePB", "failedSplit", "id", "name", "pastRuns", "playerId", "splits", "startDate", "status", "type", "worldRecord") SELECT "badges", "completedSplits", "description", "distancePB", "failedSplit", "id", "name", "pastRuns", "playerId", "splits", "startDate", "status", "type", "worldRecord" FROM "Run";
DROP TABLE "Run";
ALTER TABLE "new_Run" RENAME TO "Run";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
