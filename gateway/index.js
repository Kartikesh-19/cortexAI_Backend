
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import proxy from "express-http-proxy";
import protect from "./middleware/auth.middleware.js";
import { getCurrentUser } from "./controllers/user.controller.js";
import { proxywithHeader } from "./utils/proxyWithHeaders.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const authService = process.env.AUTH_SERVICES;

if (!authService) {
  throw new Error("AUTH_SERVICES is missing");
}

app.use(cors({
  origin: process.env.VITE_FRONTEND_URL, 
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Gateway is running",
  });
});

// Forward /auth/login to auth service /login
app.use(
  "/auth",
  proxy(authService, {
    proxyReqPathResolver: (req) => {
      return req.url;
    },
    proxyReqBodyDecorator: (bodyContent, srcReq) => {
      return JSON.stringify(srcReq.body || {});
    },
  })
);
const chatService = process.env.CHAT_SERVICES;
const agentService = process.env.AGENT_SERVICES;
if (!chatService) {
  throw new Error("CHAT_SERVICES is missing in gateway/.env");
}

if (!agentService) {
  throw new Error("AGENT_SERVICES is missing in gateway/.env");
}

app.use("/chat",protect,proxywithHeader(chatService))
app.use("/agent",protect,proxywithHeader(agentService))
app.use("/me", (req, res, next) => {
  console.log("RES");
  next(); 
}, protect, getCurrentUser);



app.listen(PORT, () => {
  console.log(`Gateway started at ${PORT}`);
});
