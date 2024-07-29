import { auth } from "@clerk/nextjs/server"

import prismadb from "./prismadb"

export const updateTopic = async (topicId: string, topicName: string, dataUrl: string) => {
    const { userId } = auth();

    if (!userId) {
        return;
    }

    const topic = await prismadb.topics.findUnique({
        where: {
            topicId: topicId
        }
    });

    if (!topic) {        
        return "no topic found";
    }

    await prismadb.topics.update({
        where: { topicId: topicId },
        data: {},
    });
    return "success";
}

export const createTopic = async (topicId: string, topicName: string, dataUrl: string) => {
    const { userId } = auth();

    if (!userId) {
        return;
    }

    const topic = await prismadb.topics.findUnique({
        where: {
            topicId: topicId
        }
    });

    if (topic) {
        return "failure";
    }

    await prismadb.topics.create({
        data: { userId: userId, topicId: topicId, topicName: topicName, dataUrl: dataUrl },
    });

    return "success";
}

export const createOrUpdateTopic = async (topicId: string, topicName: string, dataUrl: string) => {
    const { userId } = auth();

    if (!userId) {
        return;
    }

    const topic = await prismadb.topics.findUnique({
        where: {
            userId: userId,
            topicId: topicId,
        }
    });

    if (topic) {
        await prismadb.topics.update({
            where: { userId: userId, topicId: topicId },
            data: { topicName: topicName },
        });
    } else {
        await prismadb.topics.create({
            data: { userId: userId, topicId: topicId, topicName: topicName, dataUrl: dataUrl },
        });
    }

    const finalTopic = await prismadb.topics.findUnique({
        where: {
            userId: userId,
            topicId: topicId,
        }
    });

    return JSON.stringify(finalTopic);
}

export const getTopics = async () => {
    const { userId } = auth();

    if (!userId) {
        return;
    }

    const topics = await prismadb.topics.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            lastUsed: 'desc'
        }
    });

    if (!topics) {
        return "failure"
    }

    return JSON.stringify(topics)
}

export const deleteTopic = async (topicId: string) => {
    const { userId } = auth();

    if (!userId) {
        return;
    }

    const topic = await prismadb.topics.delete({
        where: {
            userId: userId,
            topicId: topicId
        }
    });
    
    return "success"
}