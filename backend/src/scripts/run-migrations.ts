import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { migratePushCalendar } from '../migrations/migrate_push_calendar.js';
import { logger } from '../logging.js';

dotenv.config();

async function runMigrations() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI environment variable not set');
        }

        logger.info('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        logger.info('Connected to MongoDB');

        logger.info('Running migrations...');
        await migratePushCalendar();

        logger.info('All migrations completed successfully');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        logger.error('Migration failed', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

await runMigrations();
