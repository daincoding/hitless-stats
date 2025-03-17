-- AlterTable
ALTER TABLE `Admin` ADD COLUMN `permittedPlayers` JSON NOT NULL,
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'editor';
