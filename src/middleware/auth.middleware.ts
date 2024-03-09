import { NextFunction, Request, Response } from "express";
import { JwtPayload, decode, verify } from "jsonwebtoken";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jwt = req.cookies["jwt"];

    const payload: any = verify(jwt, process.env.SECRET_KEY!);

    if (!payload) {
      return res.status(401).send({
        message: "Auth Unauthenticated",
      });
    }

    const is_ambassador =
      req.baseUrl.indexOf(`${process.env.BASE_URL_AMBASSADOR}`) >= 0;

    const { id, scope } = decode(jwt) as JwtPayload;

    // verify if the user the right scope goes to the rithpath
    if (
      (is_ambassador && scope !== "ambassador") ||
      (!is_ambassador && scope !== "admin")
    ) {
      return res.status(401).send({
        message: "Unauthenticated",
      });
    }

    req.user = id;

    return next();
  } catch (error) {
    return res.status(401).send({
      message: "auth Unauthenticated",
    });
  }
};
