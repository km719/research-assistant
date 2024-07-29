"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import axios from "axios";
import { Book, BookOpenText, Ellipsis, ImageIcon, Info, LayoutDashboard, Library, MessageSquare, Music, Pencil, Settings, Trash, Trash2, VideoIcon } from "lucide-react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { deleteTopic } from "@/lib/topics";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] })

const Sidebar = ({ data, updateData }: { data: string, updateData: (data: string) => void }) => {
    const handleSelect = (data: string) => {
        updateData(data);
    }

    const deleteTopic = async (topicId: string) => {
        const response = await axios.post("/api/delete-topic", {
            topicId: topicId,
        });
        console.log(response.data);
        updateData('{"id":"","topicId":"","userId":"","topicName":"","dataUrl":"","lastUsed":""}');
    }

    const [topicList, setTopicList] = useState<string>('[{"id":"","topicId":"","userId":"","topicName":"","dataUrl":"","lastUsed":""}]');

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("calling")

                const response = await axios.post("/api/get-topics");

                console.log("response")
                console.log(typeof (response.data))
                setTopicList(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [data]);

    const pathname = usePathname();
    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#171717] text-[#ececec]">
            <div className="px-3 py-2 flex-1">
                <Link href="/home" className="flex items-center pl-2 my-6">
                    {/* <h3 className={cn("text-2xl font-bold w-full text-center", montserrat.className)}>
                        Topics
                    </h3> */}
                </Link>
                <div className="space-y-1">
                    <div onClick={() => handleSelect('{"id":"","topicId":"","userId":"","topicName":"","dataUrl":"","lastUsed":""}')} className={cn("text-md h-10 group flex p-2 mb-8 w-full justify-start font-medium cursor-pointer outline outline-white/20 hover:text-white hover:bg-white/10 rounded-lg transition", "" == JSON.parse(data).topicId ? "text-white bg-white/10" : "text-zing-400")} >
                        <div className="mx-auto">
                            New topic
                        </div>
                    </div>
                    {/* <p className="text-sm ml-3">Topics</p>
                    <hr className="solid w-60 mb-8 mx-auto"></hr> */}
                    {JSON.parse(topicList).length > 1 && JSON.parse(topicList).map((string: any) => (
                        <div onClick={() => handleSelect(JSON.stringify(string))} className={cn("text-xs h-10 group flex p-3 w-full justify-between font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition", string.topicId == JSON.parse(data).topicId ? "text-white bg-white/10" : "text-zing-400")} >
                            <span>{string.topicName}</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <span className={cn("transition ease-in-out group-hover:visible text-slate-300 duration-300", string.topicId == JSON.parse(data).topicId ? "visible" : "invisible")}><span className="transition ease-in-out hover:text-white duration-300"><Ellipsis size={16} /></span></span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {/* <DropdownMenuItem className="flex justify-between"><Pencil size={12} />Rename</DropdownMenuItem> */}
                                    <DropdownMenuItem onClick={() => deleteTopic(string.topicId)} className="flex justify-between text-red-700"><Trash2 size={12} />Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;