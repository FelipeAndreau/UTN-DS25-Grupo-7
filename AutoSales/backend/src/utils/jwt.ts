import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;

export const generateToken = (payload: object): string => jwt.sign(payload, secret, { expiresIn: "1h" });

export const verifyToken = (token: string): any => jwt.verify(token, secret);