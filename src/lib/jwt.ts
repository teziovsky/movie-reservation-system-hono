import { type JWTPayload as JWTPayloadRaw, jwtVerify, SignJWT } from "jose";

import type { User } from "@/db/schema";

import env from "@/env";

const secret = new TextEncoder().encode(env.JWT_SECRET);

interface JWTPayload {
  userId: User["id"];
  exp: JWTPayloadRaw["exp"];
}

export function generateToken(payload: { userId: User["id"] }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2h")
    .sign(secret);
}

export function verifyToken(token: string) {
  return jwtVerify<JWTPayload>(token, secret);
}
