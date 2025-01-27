/*
  Warnings:

  - Made the column `asShownPrice` on table `Car` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Car" ALTER COLUMN "asShownPrice" SET NOT NULL,
ALTER COLUMN "asShownPrice" SET DATA TYPE TEXT;
