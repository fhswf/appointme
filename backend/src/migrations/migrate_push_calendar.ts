import mongoose from 'mongoose';
import { UserModel } from '../models/User.js';
import { logger } from '../logging.js';

const MIGRATION_ID = 'migrate_push_calendar_v1';

interface MigrationDocument {
    _id: string;
    appliedAt: Date;
    status: 'running' | 'completed' | 'failed';
}

export async function migratePushCalendar() {
    const MigrationModel = mongoose.model<MigrationDocument>('Migration', new mongoose.Schema({
        _id: String,
        appliedAt: Date,
        status: String
    }));

    // Check if migration already applied
    const existing = await MigrationModel.findById(MIGRATION_ID);
    if (existing?.status === 'completed') {
        logger.info('Migration migrate_push_calendar_v1 already applied, skipping');
        return;
    }

    // Mark migration as running
    await MigrationModel.findByIdAndUpdate(
        MIGRATION_ID,
        { _id: MIGRATION_ID, appliedAt: new Date(), status: 'running' },
        { upsert: true }
    );

    try {
        // Find all users with push_calendar set
        const users = await UserModel.find({
            push_calendar: { $ne: null, $exists: true }
        }).exec();

        logger.info(`Migrating ${users.length} users with push_calendar field`);

        let migrated = 0;
        for (const user of users) {
            // Only migrate if push_calendars is empty
            if (!user.push_calendars || user.push_calendars.length === 0) {
                user.push_calendars = [user.push_calendar];
                migrated++;
            }
            // Clear the old field
            user.push_calendar = undefined;
            await user.save();
        }

        // Mark migration as completed
        await MigrationModel.findByIdAndUpdate(MIGRATION_ID, { status: 'completed' });
        logger.info(`Migration completed successfully. Migrated ${migrated} users, updated ${users.length} total.`);
    } catch (error) {
        // Mark migration as failed
        await MigrationModel.findByIdAndUpdate(MIGRATION_ID, { status: 'failed' });
        logger.error('Migration failed', error);
        throw error;
    }
}
