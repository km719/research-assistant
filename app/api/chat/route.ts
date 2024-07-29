import { NextResponse } from "next/server";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

export async function POST(
    req: Request
) {
    try{
        const body = await req.json();
        const messages = body.messages
        
        const chatSession = model.startChat({
            history: messages
          });
        const result = await chatSession.sendMessage(body.prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json(text)

    } catch (error) {
        return new NextResponse("Internal error", { status: 500 })
    }
}