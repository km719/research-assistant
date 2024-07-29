import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getTopics } from "@/lib/topics";

export async function POST(
    req: Request
) {
    try{
        const { userId } = auth();

        if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
        }

        const topics = await getTopics();
        
        return NextResponse.json(topics)

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}