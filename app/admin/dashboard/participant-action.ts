'use server'

import { db } from '@/lib/db';
import { techStacks, participants, jetbrainsLicenses } from '@/lib/schema';

export const getParticipantsForAdmin = async () => {
        const [
            participantsCount,
            stacksCount,
            licensesCount
        ] = await Promise.all([
            db.select().from(participants).execute(),
            db.select().from(techStacks).execute(),
            db.select().from(jetbrainsLicenses).execute(),
            ]);

        return [
            participantsCount,
            stacksCount,
            licensesCount
        ];
}