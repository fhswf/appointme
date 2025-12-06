import dotenv from "dotenv";
import { logger } from "../logging.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
