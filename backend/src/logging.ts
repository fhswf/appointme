import { createLogger, format, transports } from 'winston';
import 'winston-mongodb';

const logTransports: any[] = [
    // Always keep some local file logging for fallback/debug if needed, or make optional?
    // User complaint suggests K8s logs (stdout) are main source.
    // Keeping existing file logs for now to avoid breaking existing workflow completely, but K8s ephemeral storage considerations aside.
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
];

// 1. Console Logging Configuration
if (process.env.CONSOLE_LOGGING !== 'false') {
    logTransports.push(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }));
}

// 2. MongoDB Logging Configuration
if (process.env.MONGODB_LOG_URI) {
    logTransports.push(new (transports as any).MongoDB({
        db: process.env.MONGODB_LOG_URI,
        collection: 'logs',
        level: process.env.LOG_LEVEL || 'info',
        options: { useUnifiedTopology: true },
        tryReconnect: true
    }));
}

// 3. Remote Logging (HTTP) Configuration
if (process.env.REMOTE_LOG_URL) {
    const remoteUrl = new URL(process.env.REMOTE_LOG_URL);
    logTransports.push(new transports.Http({
        host: remoteUrl.hostname,
        port: remoteUrl.port ? parseInt(remoteUrl.port) : (remoteUrl.protocol === 'https:' ? 443 : 80),
        path: remoteUrl.pathname,
        ssl: remoteUrl.protocol === 'https:'
    }));
}

export const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'appoint-backend' },
    transports: logTransports,
});


