import { jwtVerify, SignJWT } from "jose";

import type { User } from "@/db/schema";

import env from "@/env";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export function generateToken(payload: { userId: User["id"] }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2h")
    .sign(secret);
}

export function verifyToken(token: string) {
  return jwtVerify(token, secret);
}
