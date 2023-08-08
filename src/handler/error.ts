import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "@/type/api";
import { BadRequest, Conflict, NotFound, Unauthorized } from "@/type/error";
// import { verifyToken } from "@/util/http";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
export const internalErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof SyntaxError) {
    // JSON syntax invalid
    console.log("[SyntaxError]");
    console.log(err.message);
    return res.status(400).json({ message: err.message });
  }
  if (err instanceof Conflict) {
    console.log("[Conflict]");
    console.log(err.message);
    return res.status(err.status).json({ message: err.message });
  }
  if (err instanceof Unauthorized) {
    console.log("[Unauthorized]");
    console.log(err.message);
    return res.status(err.status).json({ message: err.message });
  }
  if (err instanceof BadRequest) {
    console.log("[BadRequest]");
    console.log(err.message);
    return res.status(err.status).json({ message: err.message });
  }
  if (err instanceof NotFound) {
    console.log("[NotFound]");
    return res.status(err.status).json({ message: err.message });
  }
  console.log(req);
  console.log(err.message);
  return res.status(500).json({ message: "Internal Server Error" });
};
/* eslint-enable */

/* eslint-disable @typescript-eslint/no-explicit-any */
export const tryWrapAPI = (
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    ...rest: any[]
  ) => Promise<ApiResponse>,
  ...rest: any[]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return handler(req, res, next, ...rest)
        .then(({ status, data }) => {
          return res.status(status).json(data);
        })
        .catch((err) => next(err));
    } catch (err) {
      next(err);
    }
  };
};
/* eslint-enable */

// export const AuthGuard = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.cookies["token"];
//   if (!token) {
//     throw new Unauthorized("no token provided");
//   }
//   const decodedPayload = verifyToken(token);
//   const userId = Number(decodedPayload);
//   if (isNaN(userId)) {
//     throw new Unauthorized("decoded token payload is invalid");
//   }
//   req.userId = userId;
//   next();
// };
