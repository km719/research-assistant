import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid";
import { deleteTopic } from "@/lib/topics";
import AWS from 'aws-sdk';
import axios from "axios";

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: "us-east-1",
});

export const deleteFromS3 = async (fileName: string): Promise<string> => {
    const params = {
      Bucket: "gemini-research-assistant",
      Key: `${fileName}.txt`,
    };
  
    try {
      await s3.deleteObject(params).promise();
      return `success`;
    } catch (error) {
      console.error('Error uploading topic:', error);
      throw new Error('Failed to upload topic to S3')
    }
};

export async function POST(
    req: Request
) {
    try{
        const { userId } = auth();
        const body = await req.json();
        const topicId = body.topicId

        if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
        }

        const topicS3 = await deleteFromS3(topicId);
        
        const data = await deleteTopic(topicId)

        return NextResponse.json(data)

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}