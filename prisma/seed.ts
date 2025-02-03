import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


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


async function main(){
// Helper function to parse CSV
    try {
        const trimFilePath: string = path.join("public", `${"toyota_vehicles_full.csv"}`);
        const csvData = await parseCSV(trimFilePath);

        for (const car of csvData) {

            const normalizedModel = car['Model']?.toLowerCase().replace(/\s+/g, "") || "";
    
            const carRecord = await prisma.car.upsert({
                where: {
                    model_year: {
                        model: normalizedModel,
                        year: parseFloat(car['Year']),
                    },
                },
                update: {
                    make: car['Make'] || "",
                    series: car['Series'] || "",
                    startingMsrp: parseInt(car['Starting MSRP'].replace(/\D/g, ""), 10),
                    asShownPrice: car['MSRP'] || "",
                    mileageInfo: car['Mileage Info'] || "",
                    seatingCapacity: parseFloat(car['Seating Capacity']) || 0,
                    fuelType: car['Fuel Type'] || "",
                    imageUrl: car['Image Link'] || "",
                    buildLink: car['Build Link'] || "",
                    exploreLink: car['Explore Link'] || "",
                },
                create: {
                    model: normalizedModel,
                    year: parseFloat(car['Year']),
                    make: car['Make'] || "",
                    series: car['Series'] || "",
                    startingMsrp: parseInt(car['Starting MSRP'].replace(/\D/g, ""), 10),
                    asShownPrice: car['MSRP'] || "",
                    mileageInfo: car['Mileage Info'] || "",
                    seatingCapacity: parseFloat(car['Seating Capacity'] )|| 0,
                    fuelType: car['Fuel Type'] || "",
                    imageUrl: car['Image Link'] || "",
                    buildLink: car['Build Link'] || "",
                    exploreLink: car['Explore Link'] || "",
                }
            });
        }

        console.log('card record accomplished')
        
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
          
            const [yearStr, model] = filename.split("_");
           
            const year = parseInt(yearStr, 10);

            const normalizedModel = model?.toLowerCase().replace(/\s+/g, "") || "";

            console.log('this is normalized model', normalizedModel)
            console.log('this is car year', year)

            const carRecord = await prisma.car.findUnique({
                where: {
                    model_year: {
                        model: normalizedModel,
                        year: year,
                    },
                },
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
    } catch (error) {
        console.error(error);
       
    }
    
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
