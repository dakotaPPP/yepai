/*
  Warnings:

  - You are about to drop the column `buildUrl` on the `Spec` table. All the data in the column will be lost.
  - You are about to drop the column `carId` on the `Spec` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Spec` table. All the data in the column will be lost.
  - You are about to drop the column `mpg` on the `Spec` table. All the data in the column will be lost.
  - You are about to drop the column `msrp` on the `Spec` table. All the data in the column will be lost.
  - You are about to drop the column `specName` on the `Spec` table. All the data in the column will be lost.
  - You are about to drop the `Detail` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Spec` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `Spec` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colorImgUrl` to the `Spec` table without a default value. This is not possible if the table is not empty.
  - Added the required column `driveTrain` to the `Spec` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interColor` to the `Spec` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Spec` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transmission` to the `Spec` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trimId` to the `Spec` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Detail" DROP CONSTRAINT "Detail_specId_fkey";

-- DropForeignKey
ALTER TABLE "Spec" DROP CONSTRAINT "Spec_carId_fkey";

-- AlterTable
ALTER TABLE "Spec" DROP COLUMN "buildUrl",
DROP COLUMN "carId",
DROP COLUMN "imageUrl",
DROP COLUMN "mpg",
DROP COLUMN "msrp",
DROP COLUMN "specName",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "colorImgUrl" TEXT NOT NULL,
ADD COLUMN     "details" TEXT,
ADD COLUMN     "driveTrain" TEXT NOT NULL,
ADD COLUMN     "interColor" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "transmission" TEXT NOT NULL,
ADD COLUMN     "trimId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Detail";

-- CreateTable
CREATE TABLE "Trim" (
    "id" SERIAL NOT NULL,
    "specName" TEXT NOT NULL,
    "msrp" DOUBLE PRECISION NOT NULL,
    "buildUrl" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "mpg" TEXT NOT NULL,
    "carId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trim_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trim" ADD CONSTRAINT "Trim_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spec" ADD CONSTRAINT "Spec_trimId_fkey" FOREIGN KEY ("trimId") REFERENCES "Trim"("id") ON DELETE CASCADE ON UPDATE CASCADE;
