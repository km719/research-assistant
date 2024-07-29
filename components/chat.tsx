"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUp } from "lucide-react";

export function Chat({ data, topicData }: { data: string, topicData: string }) {
  const [disabled, setDisabled] = useState(false)

  const formSchema = z.object({
    prompt: z.string().min(1, {
      message: "Prompt is required",
    })
  })

  interface MessagePart {
    text: string;
  }

  interface Message {
    role: 'user' | 'model';
    parts: MessagePart[];
  }

  type History = Message[];

  const greeting = async () => {
    try {
      const response = await axios.post("/api/chat", {
        messages: history,
        prompt: "Greet the user."
      });
      addMessageToHistory("Greet the user.", response.data)
    } finally {
      console.log("finally")
    }
  }

  const [history, setHistory] = useState<History>([]);

  const addContext = () => {
    setHistory([
      {
        role: 'user',
        parts: [
          {
            text: `You are a personal assistant meant to help the user explore a specific topic. Be enthusiastic and engaging with the user. Use the following sets of information to assist the user with their requests about the following topic: " ${JSON.parse(topicData).title}`
          }
        ]
      },
      {
        role: 'user',
        parts: [
          {
            text: `Use information from the following links to assist the user with their requests. ${JSON.parse(topicData).links}`
          }
        ]
      },
      {
        role: 'user',
        parts: [
          {
            text: `Use information from the following webpages to assist the user with their requests. ${JSON.parse(topicData).pages}`
          }
        ]
      },
      {
        role: 'user',
        parts: [
          {
            text: `Use information from the following text to assist the user with their requests. ${JSON.parse(topicData).text}`
          }
        ]
      },
      // {
      //   role: 'model',
      //   parts: [
      //     {
      //       text: `Hello! I am a personal assistant meant to help you explore the topic of ${JSON.parse(topicData).title}. I assist you with information from sources you have provided. How can I help you today?`
      //     }
      //   ]
      // },
    ]);
  }

  React.useEffect(() => {
    addContext();
  }, [topicData]);

  // addContextToMessages("Use the following sets of information to assist the user with their requests about the topic of", JSON.parse(topicData).title)
  // addContextToMessages("Use information from the following links to assist the user with their requests.", JSON.parse(topicData).links)
  // addContextToMessages("Use information from the following webpages to assist the user with their requests.", JSON.parse(topicData).pages)
  // addContextToMessages("Use information from the following text to assist the user with their requests.", JSON.parse(topicData).text)

  const addMessageToHistory = (userMessage: string, modelMessage: string) => {
    const newUser: Message = {
      role: 'user',
      parts: [
        {
          text: userMessage
        }
      ]
    };
    const newModel: Message = {
      role: 'model',
      parts: [
        {
          text: modelMessage
        }
      ]
    };
    setHistory([...history, newUser, newModel]);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });
  const isLoading = form.formState.isSubmitting;

  const onClick = async (values: z.infer<typeof formSchema>) => {
    setDisabled(true)
    try {
      const response = await axios.post("/api/chat", {
        messages: history,
        prompt: values.prompt
      });
      addMessageToHistory(values.prompt, response.data)
      form.setValue("prompt", "")
    } finally {
      console.log("finally")
    }
    setDisabled(false)
  }

  return (
    <TabsContent value="chat" className="h-full flex flex-col">
      {/* <div className="h-full py-2 bg-[#212121] text-[#ececec] space-y-4 flex flex-col gap-y-4">
        <ScrollArea className="h-full w-full">
          <div className="flex flex-col gap-y-4">
            {history.filter((_, index) => index > 3).map((message, index) => (
              <div className={cn("p-4 px-6 w-full flex items-start gap-x-8 rounded-lg", message.role === "user" ? "bg-[#2f2f2f] border border-black/10" : "")}>
                <strong className="w-12">{message.role}:</strong>
                <p>
                  <ReactMarkdown>{message.parts[0].text as string}</ReactMarkdown>
                </p>
              </div>
            ))}
            {isLoading && (
              <div className="p-8 rounded-lg w-full flex items-center justify-center bg-[#2f2f2f] border border-black/10">
                <strong>Loading...</strong>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>*/}
      <div className="h-full py-2 bg-[#212121] text-[#ececec] space-y-4 flex flex-col gap-y-4">
        <ScrollArea className="h-full w-full mb-64">
          <div className="flex flex-col gap-y-4 ">
            {history.filter((_, index) => index > 3).map((message, index) => (
              <div className={cn("p-4 px-6 w-full flex items-start gap-x-8 rounded-lg", message.role === "user" ? "bg-[#2f2f2f] border border-black/10" : "")}>
                <strong className="w-12">{message.role}:</strong>
                <p>
                  <ReactMarkdown>{message.parts[0].text as string}</ReactMarkdown>
                </p>
              </div>
            ))}
            {isLoading && (
              <div className="p-6 rounded-lg w-full flex items-center justify-center bg-[#2f2f2f] border border-black/10">
                <strong>Loading...</strong>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="text-bottom">
      {/* <div className="mb-4 flex justify-center">
        <Form {...form}>
          <div className="w-full mx-12">
            <form onSubmit={form.handleSubmit(onClick)} className="flex rounded-full w-full focus-within:shadow-sm gap-2 border p-2 bg-[#2f2f2f]">
              <div className="flex-grow">
                <FormField name="prompt" render={({ field }) => (
                  <FormItem className="">
                    <FormControl className="m-0 p-0">
                      <Input className="bg-[#2f2f2f] placeholder:text-[#ececec] rounded-full border-0 pl-4" placeholder="Write a chat message" {...field} />
                    </FormControl>
                  </FormItem>
                )} /></div>
              <Button className="w-fit rounded-full bg-[#ececec] text-[#1f1f1f]">
                <ArrowUp strokeWidth={2} size={16} className="" />
              </Button>
            </form></div>
        </Form>
      </div> */}
      </div>
      <div className="absolute md:ml-72 bottom-0 left-0 right-0 mb-4 flex justify-center">
        <Form {...form}>
          <div className="w-full mx-12">
            <form onSubmit={form.handleSubmit(onClick)} className="flex rounded-full w-full focus-within:shadow-sm gap-2 border p-2 bg-[#2f2f2f]">
              <div className="flex-grow">
                <FormField name="prompt" render={({ field }) => (
                  <FormItem className="">
                    <FormControl className="m-0 p-0">
                      <Input className="bg-[#2f2f2f] placeholder:text-[#bcbcbc] rounded-full border-0 pl-4" placeholder="Write a chat message" {...field} />
                    </FormControl>
                  </FormItem>
                )} /></div>
              <Button className="w-fit rounded-full bg-[#ececec] text-[#1f1f1f] hover:bg-[#bcbcbc]" disabled={disabled}>
                <ArrowUp strokeWidth={3} size={16} className="" />
              </Button>
            </form></div>
        </Form>
      </div> 
    </TabsContent>
  );
}