"use server";

import { db } from "@/lib/db";
import { participantLogins } from "@/lib/schema";

export async function getParticipantLogins() {
  const logins = await db.select().from(participantLogins);
  return logins;
}

export async function addParticipant(email: string) {
  try {
    await db.insert(participantLogins).values({
      email,
      loginCount: 0,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to add participant" };
  }
}
