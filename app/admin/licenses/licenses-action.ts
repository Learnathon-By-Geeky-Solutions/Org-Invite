'use server'

// actions.ts
import { db } from "@/lib/db";
import { jetbrainsLicenses } from "@/lib/schema";

export async function getLicenses() {
  const licenses = await db.select().from(jetbrainsLicenses);
  return licenses.filter((l) => l.createdAt !== null);
}