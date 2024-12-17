"use server";

import { db } from "@/lib/db";
import { participantLogins } from "@/lib/schema";
import { eq } from "drizzle-orm";

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

export async function deleteParticipant(id: string) {
  try {
    await db.delete(participantLogins).where(eq(participantLogins.id, id));
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete participant" };
  }
}

export async function bulkAddParticipants(emails: string[]) {
  try {
    await db.insert(participantLogins).values(
      emails.map((email) => ({
        email,
        loginCount: 0,
      }))
    );
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to add participants" };
  }
}
