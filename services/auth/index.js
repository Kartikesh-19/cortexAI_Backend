// import express from "express"
// import dotenv from "dotenv"
// import { connectDB } from "./config/db.js";
// import router from "./routes/auth.route.js";

// dotenv.config()

// const port=process.env.PORT||3000

// const app=express();
// app.use(express.json())
// app.use("/", router)

// app.get("/",(req,res)=>{
//     res.status(200).json({message:"hello from auth"})
//     // res.send("hii")
// })

// app.listen(port,()=>{
//     console.log(`gateway started is at ${port}`)
//     connectDB()
// })



import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route.js";
import connectDB from "./config/db.js";

dotenv.config({
  path: new URL("./.env", import.meta.url),
});
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

app.use(cors({
  origin: process.env.VITE_FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Mount authentication routes
app.use("/", authRouter);
// app.use("/auth", Proxy(authRouter));

app.get("/", (req, res) => {
  res.json({
    message: "Auth service is running",
  });
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Auth service running at ${PORT}`);
    });
  } catch (error) {
    console.error("Auth service startup error:", error);
    process.exit(1);
  }
};

startServer();
