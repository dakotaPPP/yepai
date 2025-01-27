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
    const baseFolder = path.join(process.cwd(), "/public/data2");
    if (!fs.existsSync(baseFolder)) {
        console.error("Directory does not exist:", baseFolder);
        return;
    }
    console.log("Directory exists:", baseFolder);

    const folders = fs.readdirSync(baseFolder, { withFileTypes: true });
    console.log("Folders in directory:", folders);
   

    for (const file of folders) {
        if (file.isDirectory()) {
            console.log("Found directory:", file.name);
        } else {
            console.log("Skipping non-directory:", file.name);
        }
        const filename = file.name;
        console.log('this is the file name',filename)
        const [yearStr, model] = filename.split("_");
        console.log('this is the year str',yearStr)
        const year = parseInt(yearStr, 10);
        console.log('tyring to get year record', year)
        const yearRecord = await prisma.year.upsert({
            where: { year },
            update: {},
            create: { year },
        });
        console.log("yearrecord accompnished",yearRecord)
        if(!yearRecord){
          continue
        }

        const normalizedModel = model?.toLowerCase().replace(/\s+/g, "") || "";

        const carRecord = await prisma.car.upsert({
          where: {
            model_yearId: {
              model: normalizedModel,
              yearId: yearRecord.id,
            },
          },
            update: {},
            create:{
            
                make: normalizedModel,
                model: normalizedModel,
                series: "",
                startingMsrp: 0,
                asShownPrice: "",
                mileageInfo: "",
                seatingCapacity: 0,
                fuelType: "",
                imageUrl: "",
                buildLink: "",
                exploreLink: "",
                yearId: yearRecord.id,
                

            }
          
        });

        console.log('card record accomplished', carRecord)

        const trimFilePath: string = path.join(baseFolder, `${filename}`);
        const csvData = await parseCSV(trimFilePath);

        for (const trim of csvData) {
            if (!trim['MSRP'])
            {
                console.error('msrp missing')
                continue
            }
            const cleanedPrice = parseFloat(trim['MSRP'].replace(/[\$,]/g, ""));

            if (!carRecord || isNaN((cleanedPrice))) {
                console.error("Invalid trim data:", trim);
                continue; // Skip this record
            }
            

            const trimRecord = await prisma.trim.create({
                data: {
                  trimName: trim["Model"] || "", // Provide default if missing
                  msrp: cleanedPrice, // Parse and convert the MSRP value
                  buildUrl: trim["Build URL"] || "",
                  imageUrl: trim["Image URL_x"] || "",
                  mpg: trim["MPG"] || "N/A", // Provide default if missing
                  car: {
                    connect: {
                      id: carRecord.id, // Ensure carRecord.id exists
                    },
                  },
                },
            });

            await prisma.spec.create({
                data: {
                    category: trim["Category"] || "",
                    colorImgUrl: trim["Image URL_y"] || "",
                    color: trim['Name'] ,
                    interColor: "",
                    transmission: "",
                    driveTrain: "",
                    name: trim["Model"] || "",
                    price: cleanedPrice,
                    details: trim["Price/Details"] || "",
                    trim: {
                        connect:{
                          id: trimRecord.id,
                      }
                    }
                     
                },
            });
        }
    }

    return NextResponse.json({ message: "Database populated successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to populate database" },
      { status: 500 }
    );
  }
}
