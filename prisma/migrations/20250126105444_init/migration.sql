-- CreateTable
CREATE TABLE "Year" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Year_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "startingMsrp" DOUBLE PRECISION NOT NULL,
    "asShownPrice" DOUBLE PRECISION NOT NULL,
    "mileageInfo" TEXT NOT NULL,
    "seatingCapacity" INTEGER NOT NULL,
    "fuelType" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "buildLink" TEXT NOT NULL,
    "exploreLink" TEXT NOT NULL,
    "yearId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spec" (
    "id" SERIAL NOT NULL,
    "specName" TEXT NOT NULL,
    "msrp" DOUBLE PRECISION NOT NULL,
    "buildUrl" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "mpg" TEXT NOT NULL,
    "carId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Detail" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "details" TEXT,
    "color" TEXT NOT NULL,
    "colorImgUrl" TEXT NOT NULL,
    "interColor" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "driveTrain" TEXT NOT NULL,
    "specId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Detail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "Year"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spec" ADD CONSTRAINT "Spec_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detail" ADD CONSTRAINT "Detail_specId_fkey" FOREIGN KEY ("specId") REFERENCES "Spec"("id") ON DELETE CASCADE ON UPDATE CASCADE;
