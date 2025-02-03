
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { PrismaClient } from '@prisma/client';
import { convertToCoreMessages } from 'ai';

const prisma = new PrismaClient();
const decoder = new TextDecoder("utf-8");


async function readStream(reader:any) {
  let responseText : string = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Decode the chunk and append it to the responseText
    responseText += decoder.decode(value, { stream: true });
  }

  //Decode Response Text 
  const lines = responseText.split("\n")
  
  let cleanedString = '';

  for(const line of lines){
    if (line.startsWith("0:")) {
      const trimmedLine = line.slice(3).trim().slice(0, -1);
      cleanedString += trimmedLine;
    }
  }

  console.log("this is the cleaned Json string",cleanedString)

  let cleanedKson = cleanedString.replace(/^```json/, "").replace(/```$/, "");

  console.log('cleanjson', cleanedKson)

  // Extract the JSON block
  const jsonStart = responseText.indexOf("{");
  const jsonEnd = responseText.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1) {
    const jsonString = responseText.slice(jsonStart, jsonEnd + 1);

    // Clean up the JSON string
    const cleanedJsonString = cleanedString
      .replace(/^f:.*?{/, "{") // Remove 'f:' and anything before the first '{'
      .replace(/\\n/g, ""); // Remove escaped newlines

    console.log('cleaned json', cleanedJsonString)
    try {
      const parsedData = JSON.parse(cleanedJsonString);
      console.log("Parsed JSON Data:", parsedData);
      return parsedData; // Return parsed JSON if needed
    } catch (err) {
      console.error("Error parsing JSON:", err);
    }
  } else {
    console.error("No JSON content found in the response");
  }
}
// // Allow streaming responses up to 30 seconds
// const handleResponse = (input: string) => {
//   const startIndex = input.indexOf("{");
//   const endIndex = input.lastIndexOf("}");
//   const jsonContent = input.slice(startIndex,endIndex + 1);
//   const parsed = JSON.parse(jsonContent);
// }



export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Step 1: Query ChatGPT to get JSON values
  const result = await streamText({
    model: openai('gpt-4o'),
    messages: convertToCoreMessages(messages),
  });

  
  //  console.log('this is result',result.toDataStreamResponse());



  // console.log('initial Result', initialResult)
  const initialResponse = await result.toDataStreamResponse().json();
  console.log('initial response 2', initialResponse)
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