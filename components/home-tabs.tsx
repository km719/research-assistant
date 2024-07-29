"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Chat } from "./chat"
import { Sources } from "./sources";
import { useState } from "react";

export function HomeTabs({data, topicData, updateData}: {data: string, topicData: string, updateData: (data: string) => void}) {
  return (
    <Tabs defaultValue="sources" className="h-full">
      <TabsList className="grid w-full grid-cols-2 text-[#ececec] bg-[#2f2f2f]">
        <TabsTrigger value="sources">Sources</TabsTrigger>
        <TabsTrigger value="chat">Chat</TabsTrigger>
      </TabsList>
      <h2 className="text-2xl md:text-4xl font-bold text-center my-6">{JSON.parse(topicData).title === "" ? "New Topic" : JSON.parse(topicData).title}</h2>
      <Sources data={data} topicData={topicData} updateData={updateData} />
      <Chat data={data} topicData={topicData} />
    </Tabs>
  )
}
