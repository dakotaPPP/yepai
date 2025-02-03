import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fromEntries } from "remeda";

export async function POST(req: NextRequest) {
  const { minprice, maxprice, fuelType, model} = await req.json()

  const where: any = {};

  if (minprice) {
    where.startingMsrp = { gte: minprice };
  }

  if (maxprice) {
    where.startingMsrp = { ...(where.startingMsrp || {}), lte: maxprice };
  }

  // if (fuelType) {
  //   where.fuelType = fuelType;
  // }

  // if (model) {
  //   where.model = model;
  // }


  // // Step 2: Query Prisma database using JSON values
  const dbQueryResult = await prisma.car.findMany({
    where,
    include: {
      trims: {
        select: {
          trimName: true,
          msrp: true,
          buildUrl: true,
        },
      },
    },
  });


 
  // // Step 3: Format the database query results
  let formattedResponse;
  if (dbQueryResult.length > 0) {
    formattedResponse = dbQueryResult.map(car => ({
      image_url: car.imageUrl,
      price: car.startingMsrp,
      model: car.model,
      year: car.year,
      buildUrl: car.trims.at(0)?.buildUrl,
    }));
  } else {
    formattedResponse = { error: "No results found" };
  }



  return NextResponse.json(formattedResponse)

}
