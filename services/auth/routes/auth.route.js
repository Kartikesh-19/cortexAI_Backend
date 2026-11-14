// import express from "express";
// import { login } from "../controller/auth.controller.js";

// const router=express.Router()

// router.post("/login", login)
// export default router;

import express from "express";
import { login, Logout } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout",Logout);

export default router;