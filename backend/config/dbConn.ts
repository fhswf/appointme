import mongoose from "mongoose";

const mongo_url = process.env.MONGO_URI || "mongodb://localhost:27017/bookme"

/**
 * Function to async connect to the database
 * @function
 */
export const dataBaseConn = async () => {
  const connectOptions : mongoose.ConnectOptions = {

  };
  const connection = await mongoose.connect(mongo_url, connectOptions);

  console.log(`MongoDB Connected: ${connection.connection.host}`);
};


