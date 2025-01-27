import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Step 1: Query ChatGPT to get JSON values
  const initialResult = await streamText({
    model: openai('gpt-4o'),
    messages,
  }).toDataStreamResponse();

  const initialResponse = await initialResult.json();
  const jsonResponse = JSON.parse(initialResponse.content);

  // Step 2: Query Prisma database using JSON values
  const dbQueryResult = await prisma.car.findMany({
    where: {
      startingMsrp: {
        gte: jsonResponse['min-price'],
        lte: jsonResponse['max-price'],
      },
      fuelType: jsonResponse['fuel-type'],
    },
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

  // Step 3: Format the database query results
  let formattedResponse;
  if (dbQueryResult.length > 0) {
    formattedResponse = dbQueryResult.map(car => ({
      image_url: car.imageUrl,
      price: car.trims.at(0)?.msrp,
      model: car.model,
      year: car.yearId + 2021,
      trims: car.trims,
      buildUrl: car.trims.at(0)?.buildUrl,
    }));
  } else {
    formattedResponse = { error: "No results found" };
  }

  // Step 4: Get response from ChatGPT based on database query results
  const finalMessages = [
    ...messages,
    {
      role: 'system',
      content: `{"database-input": ${JSON.stringify(formattedResponse)}}`,
    },
  ];

  const finalResult = streamText({
    model: openai('gpt-4o'),
    messages: finalMessages,
  });

  return finalResult.toDataStreamResponse();
}