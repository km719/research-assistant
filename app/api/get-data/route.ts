import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid";
import { createTopic, updateTopic } from "@/lib/topics";
import AWS from 'aws-sdk';
import axios from "axios";

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: "us-east-1",
});

export const getDataFromS3 = async (fileName: string): Promise<string> => {
    const params = {
      Bucket: "gemini-research-assistant",
      Key: fileName,
    };
  
    try {
      console.log('going in')
      const data = await s3.getObject(params).promise();
      console.log(data)
      return data.Body?.toString() || "";

    } catch (error) {
      console.error('Error getting topic:', error);
      throw new Error('Failed to get topic from S3')
    }
};

export async function POST(
    req: Request
) {
    try{
        const { userId } = auth();
        const body = await req.json();
        console.log(body)
        const { dataUrl } = body
        console.log(dataUrl)
        const key = dataUrl.split('/').pop()
        console.log(key)

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const data = await getDataFromS3(key);
        
        // await createTopic(uuidv4(), title, topicS3)

        return NextResponse.json(data)

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}