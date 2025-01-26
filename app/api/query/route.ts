import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { model: string } }) {
  const { model } = params;
  const number: number = 0 

  try {
    // Query the database for the car model and include related trims
    const carWithTrims = await prisma.car.findUnique({
      where: {
        id : number,
      },
      include: {
        trims: true, // Includes related trims
      },
    });

    // Handle case where the car model doesn't exist
    if (!carWithTrims) {
      return NextResponse.json({ error: "Car model not found" }, { status: 404 });
    }

    return NextResponse.json(carWithTrims);
  } catch (error) {
    console.error("Error fetching car data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching car data" },
      { status: 500 }
    );
  }
}
