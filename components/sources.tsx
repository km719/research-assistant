import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TabsContent } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "./ui/textarea";


export function Sources({ data, topicData, updateData }: { data: string, topicData: string, updateData: (data: string) => void }) {
    const [disabled, setDisabled] = useState(false)


    const formSchema = z.object({
        title: z.string().optional().default(JSON.parse(topicData).title),
        links: z.string().optional().default(JSON.parse(topicData).links),
        pages: z.string().optional().default(JSON.parse(topicData).pages),
        text: z.string().optional().default(JSON.parse(topicData).text),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const isLoading = form.formState.isSubmitting;

    const onClick = async (values: z.infer<typeof formSchema>) => {
        setDisabled(true)
        try {
            const response = await axios.post("/api/topic", {
                topicId: JSON.parse(data).topicId,
                content: {
                    title: values.title,
                    links: values.links,
                    pages: values.pages,
                    text: values.text,
                }
            });
            updateData(response.data)
        } finally {
            console.log("finally")
        }
        setDisabled(false)
    }

    return (
        <TabsContent value="sources" className="h-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onClick)} className="h-full">
                    <div className="h-full bg-[#212121] pb-64">
                        <ScrollArea className="h-full w-full pr-3">
                            <div>
                                {/* <p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p><p>Hi</p> */}
                                <FormField name="title" render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input className="bg-[#2f2f2f] placeholder:text-[#bcbcbc]" defaultValue={JSON.parse(topicData).title} placeholder="Name your topic" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} />
                                <Accordion type="multiple" className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>Links</AccordionTrigger>
                                        <AccordionContent>
                                            <FormField name="links" render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input className="bg-[#2f2f2f] placeholder:text-[#bcbcbc]" defaultValue={JSON.parse(topicData).links} placeholder="https://en.wikipedia.org/wiki/Research" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>Webpages</AccordionTrigger>
                                        <AccordionContent>
                                            <FormField name="pages" render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea className="bg-[#2f2f2f] placeholder:text-[#bcbcbc]" defaultValue={JSON.parse(topicData).pages} placeholder="<html>...</html>" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>Text Blocks</AccordionTrigger>
                                        <AccordionContent>
                                            <FormField name="text" render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea className="bg-[#2f2f2f] placeholder:text-[#bcbcbc]" defaultValue={JSON.parse(topicData).text} placeholder="Enter or paste your text here" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </ScrollArea>
                    </div>
                    {/* <Button disabled={disabled}>Save changes</Button>
                    {disabled &&
                        <div className="mx-4">
                            <strong>Saving...</strong>
                        </div>} */}
                    <div className="absolute md:ml-72 bottom-0 left-12 mb-4 flex justify-center">
                        <Button className="bg-[#ececec] text-[#1f1f1f] hover:bg-[#bcbcbc]" disabled={disabled}>Save changes</Button>
                        {disabled &&
                            <div className="mx-4 mt-2">
                                <strong>Saving...</strong>
                            </div>}
                    </div>
                </form>
            </Form>
        </TabsContent>
    )
}