"use client";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { HomeTabs } from "@/components/home-tabs";
import axios from "axios";
import React, { useState } from "react";

export default function Home({
  children,
}: {
  children: React.ReactNode;
}) {
  const [metadata, setMetadata] = useState<string>('{"id":"","topicId":"","userId":"","topicName":"","dataUrl":"","lastUsed":""}')
  const [content, setContent] = useState<string>('{"title":"","links":"","pages":"","text":""}')
  const [loadingTopic, setLoadingTopic] = useState<boolean>(false)

  const fillForm = async () => {
    setLoadingTopic(true);
    if (JSON.parse(metadata).topicId === "") {
      setContent('{"title":"","links":"","pages":"","text":""}')
    } else {
      try {
        const response = await axios.post("/api/get-data", {
          dataUrl: JSON.parse(metadata).dataUrl
        })
        setContent(response.data)
      } catch (error) {
        console.error(error);
      }
    }
    setTimeout(() => {setLoadingTopic(false)}, 0);
  }

  React.useEffect(() => {
    setLoadingTopic(true);
    fillForm();
  }, [metadata]);

  const updateMetadata = (newMetadata: string) => {
    setMetadata(newMetadata);
  }

  const updateLoadingtopic = (newLoadingTopic: boolean) => {
    setLoadingTopic(newLoadingTopic);
  }

  return (
    <div className="h-screen relative bg-[#212121] text-[#ececec] overflow-hidden">
    {/* <div className="h-screen relative bg-[#212121] text-[#ececec]"> */}
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
        <Sidebar data={metadata} updateData={updateMetadata} />
      </div>
      <main className="md:pl-72 h-full">
        <Navbar data={metadata} updateData={updateMetadata} />
        {loadingTopic
          ? <div className="flex justify-center items-center h-96">Loading...</div>
          : <div className="px-12 w-full h-full">
              <HomeTabs data={metadata} topicData={content} updateData={updateMetadata} />
            </div>
        }
      </main>
    </div>
  );
}