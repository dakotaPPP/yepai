/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Year` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Year` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[year]` on the table `Year` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Car" ALTER COLUMN "make" DROP NOT NULL,
ALTER COLUMN "series" DROP NOT NULL,
ALTER COLUMN "startingMsrp" DROP NOT NULL,
ALTER COLUMN "asShownPrice" DROP NOT NULL,
ALTER COLUMN "mileageInfo" DROP NOT NULL,
ALTER COLUMN "seatingCapacity" DROP NOT NULL,
ALTER COLUMN "fuelType" DROP NOT NULL,
ALTER COLUMN "imageUrl" DROP NOT NULL,
ALTER COLUMN "buildLink" DROP NOT NULL,
ALTER COLUMN "exploreLink" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Year" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE UNIQUE INDEX "Year_year_key" ON "Year"("year");
