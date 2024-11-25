'use server'

import { db } from '@/lib/db';
import { admins } from '@/lib/schema';

export async function getAdmins() {
  return await db.select().from(admins);
}