
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dataBaseConn } from "./config/dbConn.js";


// Dotenv Config
import dotenv from "dotenv";
dotenv.config({
  path: "./config/config.env",
});

const app = express();

app.use(cookieParser());

//Connecting to the database
dataBaseConn();

//Bodyparser
app.use(bodyParser.json());

// Dev Loggin Middleware
if (process.env.NODE_ENV === "development") {
  console.log("enabling CORS for %s", process.env.CLIENT_URL);
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );
}

//Load routes
import { authenticationRouter } from "./routes/authentication_route.js";
import { eventRouter } from "./routes/event_routes.js";
import { googleRouter } from "./routes/google_routes.js";
import { userRouter } from "./routes/user_routes.js";

//Use routes
const router = express.Router();
router.use("/auth/", authenticationRouter);
router.use("/events/", eventRouter);
router.use("/google/", googleRouter);
router.use("/users/", userRouter);
app.use("/bookme/api/v1", router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
