import { NextFunction, Request, Response } from "express"
import { JwtPayload, decode, verify } from "jsonwebtoken";

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jwt = req.cookies["jwt"];

    const payload: any = verify(jwt, process.env.SECRET_KEY!);

    if (!payload) {
      return res.status(401).send({
        message: "Auth Unauthenticated",
      });
    }

    const { id } = decode(jwt) as JwtPayload
    req.user = id

    return next()
  } catch (error) {
    return res.status(401).send({
      message: "auth Unauthenticated",
    });
  }
}