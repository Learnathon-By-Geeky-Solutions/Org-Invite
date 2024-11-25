'use server'

import { db } from "@/lib/db";
import { techStacks } from "@/lib/schema";

export async function getStacks() {
  const stacks = await db
    .select()
    .from(techStacks)
    .then((stacks) =>
      stacks.map((stack) => ({
        ...stack,
        icon: stack.icon ?? "",
      }))
    );
  
  return stacks;
}