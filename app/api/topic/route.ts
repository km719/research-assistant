import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid";
import { createOrUpdateTopic, createTopic, updateTopic } from "@/lib/topics";
import AWS from 'aws-sdk';
import axios from "axios";

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: "us-east-1",
});

export const uploadDataToS3 = async (data: String, fileName: string): Promise<string> => {
    const params = {
      Bucket: "gemini-research-assistant",
      Key: `${fileName}.txt`,
      Body: data,
    };
  
    try {
      await s3.upload(params).promise();
      return `https://gemini-research-assistant.s3.amazonaws.com/${fileName}.txt`;
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
        console.log(body)
        const topicId = body.topicId === "" ? uuidv4() : body.topicId
        const title = body.content.title
        const topic = JSON.stringify(body.content);
        console.log(topic)

        if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
        }

        const topicS3 = await uploadDataToS3(topic, topicId);
        
        const data = await createOrUpdateTopic(topicId, title, topicS3)

        return NextResponse.json(data)

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}