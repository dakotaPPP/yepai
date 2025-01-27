/*
  Warnings:

  - You are about to drop the column `specName` on the `Trim` table. All the data in the column will be lost.
  - Added the required column `trimName` to the `Trim` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trim" DROP COLUMN "specName",
ADD COLUMN     "trimName" TEXT NOT NULL;
