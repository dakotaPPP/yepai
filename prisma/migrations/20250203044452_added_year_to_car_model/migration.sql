/*
  Warnings:

  - You are about to drop the column `yearId` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the `Year` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[model,year]` on the table `Car` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `year` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_yearId_fkey";

-- DropIndex
DROP INDEX "Car_model_yearId_key";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "yearId",
ADD COLUMN     "year" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Year";

-- CreateIndex
CREATE UNIQUE INDEX "Car_model_year_key" ON "Car"("model", "year");
