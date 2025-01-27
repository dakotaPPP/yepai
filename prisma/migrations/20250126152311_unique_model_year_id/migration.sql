/*
  Warnings:

  - A unique constraint covering the columns `[model,yearId]` on the table `Car` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Car_model_yearId_key" ON "Car"("model", "yearId");
