
import express from "express";
// import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router  from "./routes/agent.route.js";
// import cookieParser from "cookie-parser";

// import authRouter from "./routes/auth.route.js";
// import connectDB from "../config/db.js";

dotenv.config({
  path: new URL("./.env", import.meta.url),
});
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// app.use(cors({
//   origin: process.env.VITE_FRONTEND_URL,
//   credentials: true,
// }));

app.use(express.json());
app.use("/", router);

// Mount authentication routes
// app.use("/auth", Proxy(authRouter));

app.get("/", (req, res) => {
  res.json({
    message: "hello from agent",
  });
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Agent service running at ${PORT}`);
    });
  } catch (error) {
    console.error("Agent service startup error:", error);
    process.exit(1);
  }
};

startServer();
