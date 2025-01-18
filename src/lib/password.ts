import { argon2id, hash, verify } from "argon2";

export async function hashPassword(password: string): Promise<string> {
  try {
    return await hash(password, {
      type: argon2id,
      memoryCost: 2 ** 16, // 64MB memory usage
      timeCost: 3, // Number of iterations
      parallelism: 1, // Degree of parallelism
    });
  }
  catch {
    throw new Error("Error hashing password");
  }
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    return await verify(hash, password);
  }
  catch {
    return false;
  }
}
