import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import { prisma } from "@/lib/prisma";
import { connect } from "http2";

// Helper function to parse CSV
const parseCSV = (filePath: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data: any) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err: any) => reject(err));
  });
};

// POST handler
export async function GET(req: NextRequest) {
  try {
        const trimFilePath: string = path.join("public", `${"toyota_vehicles_full.csv"}`);
        const csvData = await parseCSV(trimFilePath);

        for (const car of csvData) {
            const yearRecord = await prisma.year.upsert({
              where: { year:parseFloat(car['Year']) },
              update: {},
              create: { year:parseFloat(car['Year']) },
          });
          if(!yearRecord){
            continue
          }

          const normalizedModel = car['Model']?.toLowerCase().replace(/\s+/g, "") || "";
  
          const carRecord = await prisma.car.upsert({
            where: {
              model_yearId: {
                model: normalizedModel,
                yearId: yearRecord.id,
              },
            },
            update: {
              make: car['Make'] || "",
              series: car['Series'] || "",
              startingMsrp: parseFloat(car['Starting']) || 0,
              asShownPrice: car['MSRP'] || "",
              mileageInfo: car['Mileage Info'] || "",
              seatingCapacity: parseFloat(car['Seating Capacity']) || 0,
              fuelType: car['Fuel Type'] || "",
              imageUrl: car['Image Link'] || "",
              buildLink: car['Build Link'] || "",
              exploreLink: car['Explore Link'] || "",
              yearId: yearRecord.id,
            },
            create: {
              make: car['Make'] || "",
              model: car['Model'] || "",
              series: car['Series'] || "",
              startingMsrp: parseFloat(car['Starting']) || 0,
              asShownPrice: car['MSRP'] || "",
              mileageInfo: car['Mileage Info'] || "",
              seatingCapacity: parseFloat(car['Seating Capacity'] )|| 0,
              fuelType: car['Fuel Type'] || "",
              imageUrl: car['Image Link'] || "",
              buildLink: car['Build Link'] || "",
              exploreLink: car['Explore Link'] || "",
              yearId: yearRecord.id,
            }
          });
        }

        console.log('card record accomplished')

        

    return NextResponse.json({ message: "Database populated successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to populate database" },
      { status: 500 }
    );
  }
}
