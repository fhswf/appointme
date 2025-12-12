import mongoose from "mongoose";

import { logger } from "../logging.js";
const mongo_url = process.env.MONGO_URI || "mongodb://localhost:27017/appointme"

/**
 * Function to async connect to the database
 * @function
 */
export const dataBaseConn = (): Promise<mongoose.Connection> => {

  const connectOptions: mongoose.ConnectOptions = {

  };
  return mongoose.connect(mongo_url, connectOptions)
    .then(connection => {
      logger.info(`MongoDB Connected: ${connection.connection.host}`);
      return connection.connection;
    })
    .catch(err => {
      logger.error(`Error: ${err.message}`);
      process.exit(1);
    })
};


