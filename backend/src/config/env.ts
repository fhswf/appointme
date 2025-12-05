import dotenv from "dotenv";
import { logger } from "../logging.js";

// Load .env
dotenv.config();

// Load config.env
const result = dotenv.config({
    path: "./src/config/config.env",
});

if (result.error) {
    logger.warn("Could not load config.env", result.error);
}
