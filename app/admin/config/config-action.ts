'use server'

import { db } from "@/lib/db";
import { configurations } from "@/lib/schema";

export async function getConfig() {
  const [config] = await db.select().from(configurations);
  
  return {
    ...config,
    githubToken: config.githubToken ?? undefined,
    githubOrgName: config.githubOrgName ?? undefined,
    githubTeamSlug: config.githubTeamSlug ?? undefined,
  };
}