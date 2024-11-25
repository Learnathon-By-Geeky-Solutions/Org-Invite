'use client'

import { DiscordList, Stack } from "./discord-list";
import { useEffect, useState } from "react";
import { getTechStacks } from "./discord-action";

export default function DiscordPage() {
    const [stacks, setStacks] = useState<Stack[]>([]);
    
    useEffect(() => {
        getTechStacks().then(setStacks).catch(error => {
            console.error('Failed to fetch tech stacks:', error);
        });
    }, []);

    // Next.js will automatically use loading.tsx while the page is loading
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Discord Servers</h1>
            <div className="max-w-3xl">
                {stacks.length > 0 && <DiscordList initialStacks={stacks} />}
            </div>
        </div>
    );
}