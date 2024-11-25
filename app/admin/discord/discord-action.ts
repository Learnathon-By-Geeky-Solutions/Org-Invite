'use server'

import { db } from "@/lib/db";
import { techStacks } from "@/lib/schema";

export async function getTechStacks() {
    const stacks = await db.select().from(techStacks);
    return stacks.map((stack) => ({
        ...stack,
        icon: stack.icon ?? "",
    }));
}