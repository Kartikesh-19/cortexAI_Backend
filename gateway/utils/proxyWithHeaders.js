// import proxy from "express-http-proxy";
// export const proxywithHeader = (serviceUrl) => {
//   return proxy(serviceUrl, {
//     proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
//       if (srcReq.user) proxyReqOpts: headers["x-user-id"] = srcReq.user.userId;
//     },
//   });
// };

// import proxy from "express-http-proxy";

// export const proxywithHeader = (serviceUrl) => {
//   return proxy(serviceUrl, {
//     proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
//       proxyReqOpts.headers = {
//         ...proxyReqOpts.headers,
//       };

//       // Never forward a user ID supplied by the client.
//       delete proxyReqOpts.headers["x-user-id"];

//       if (srcReq.user?.userId) {
//         proxyReqOpts.headers["x-user-id"] = String(srcReq.user.userId);
//       }

//       return proxyReqOpts;
//     },
//   });
// };


import proxy from "express-http-proxy";

export const proxywithHeader = (serviceUrl) => {
  if (!serviceUrl) {
    throw new Error("Proxy service URL is missing");
  }

  return proxy(serviceUrl, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers = {
        ...proxyReqOpts.headers,
      };

      delete proxyReqOpts.headers["x-user-id"];

      if (srcReq.user?.userId) {
        proxyReqOpts.headers["x-user-id"] = String(srcReq.user.userId);
      }

      return proxyReqOpts;
    },

    proxyErrorHandler: (error, res, next) => {
      console.error("Proxy connection failed:", {
        target: serviceUrl,
        code: error.code,
        message: error.message,
        errors: error.errors?.map((item) => ({
          code: item.code,
          address: item.address,
          port: item.port,
        })),
      });

      return res.status(502).json({
        message: "Unable to connect to the backend service.",
      });
    },
  });
};