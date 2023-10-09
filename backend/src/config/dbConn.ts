import mongoose from "mongoose";

const mongo_url = process.env.MONGO_URI || "mongodb://localhost:27017/bookme"

/**
 * Function to async connect to the database
 * @function
 */
export const dataBaseConn = (): Promise<mongoose.Connection> => {

  const connectOptions: mongoose.ConnectOptions = {

  };
  return mongoose.connect(mongo_url, connectOptions)
    .then(connection => {
      console.log(`MongoDB Connected: ${connection.connection.host}`);
      return connection.connection;
    })
    .catch(err => {
      console.log(`Error: ${err.message}`);
      process.exit(1);
    })
};


