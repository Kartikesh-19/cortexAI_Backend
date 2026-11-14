// import redis from "../../shared/redis/redis.js"

// const protect=async(req,res,next)=>{
//     console.log("hitiing",req)

//     console.log("Cookie header present:", Boolean(req.headers.cookie));
// console.log("Session cookie present:", Boolean(req.cookies?.session));

// try {
//     const sessionId=req.cookies?.session
//     console.log("Auth check:", {
//         hasCookieHeader: Boolean(req.headers.cookie),
//         hasSessionCookie: Boolean(sessionId),
//       });
//         console.log("session", sessionId)
//         if(!sessionId) return res.status(400).json({messsage:"Unauthorized"})
//             const session= await redis.get(`session-${sessionId}`)
//         if(!session) return res.status(400).json({messsage:"session expired"})
//             req.user=JSON.parse(session)
//         next()

//     } catch (error) {
//          res.status(500).json({messsage:`protect error ${error}`})
//         // console.log("error====>", error)
        
//     }
// }
// export default protect;

import redis from "../../shared/redis/redis.js";

const protect = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: "Session cookie is missing",
      });
    }

    const session = await redis.get(`session-${sessionId}`);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired or not found",
      });
    }

    req.user = JSON.parse(session);
    return next();
  } catch (error) {
    console.error("Session verification failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify session",
    });
  }
};

export default protect;