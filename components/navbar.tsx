"use client";

import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "@/components/mobile-sidebar";
import { Coins } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = ({data, updateData}: {data: string, updateData: (data: string) => void}) => {
    return(
        <div className="flex items-center p-4">
            <MobileSidebar data={data} updateData={updateData} />
            <div className="flex flex-row w-full justify-end text-md">
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    );
}

export default Navbar;