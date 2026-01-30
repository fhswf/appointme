import dotenv from "dotenv";
import { logger } from "../logging.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../");

// Load .env explicitly from package root
dotenv.config({ path: path.join(rootDir, ".env") });

// Load config.env
const result = dotenv.config({
    path: path.join(rootDir, "src/config/config.env"),
});

if (result.error) {
    logger.warn("Could not load config.env", result.error);
}



export const loadDir = (dirPath: string) => {
    try {
        if (!fs.existsSync(dirPath)) {
            logger.info(`Directory ${dirPath} does not exist, skipping.`);
            return;
        }

        const files = fs.readdirSync(dirPath);

        for (const file of files) {
            const fullPath = path.join(dirPath, file);
            const stat = fs.statSync(fullPath);

            if (stat.isFile()) {
                const content = fs.readFileSync(fullPath, "utf8").trim();
                process.env[file] = content;
                logger.info(`Loaded env from file: ${file}`);
            }
        }
    } catch (error) {
        logger.error(`Error loading env from ${dirPath}`, error);
    }
};

// Load config from /etc/config (default for K8s ConfigMap mounts)
const configPath = process.env.CONFIG_PATH || "/etc/config";
loadDir(configPath);

// Load secrets from /etc/secrets (default for K8s Secret mounts)
// Secrets are loaded AFTER config, allowing them to override if needed
const secretsPath = process.env.SECRETS_PATH || "/etc/secrets";
loadDir(secretsPath);
