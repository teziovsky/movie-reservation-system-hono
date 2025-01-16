import { createHash } from "node:crypto";

export async function hash(password: string): Promise<string> {
  return createHash("sha256").update(password).digest("hex");
}
