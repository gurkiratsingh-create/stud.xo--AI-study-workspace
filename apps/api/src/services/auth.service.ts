import { db } from "../config/database.js";
import { users } from "../db/schema/index.js";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "../utils/auth.js";
import type {
  RegisterInput,
  LoginInput,
} from "../schemas/auth.schema.js";
import jwt from "jsonwebtoken";

export async function registerUser(input: RegisterInput) {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  const passwordHash = await hashPassword(input.password);

  const [user] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      passwordHash,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
    });

  return user;
}

export async function loginUser(input: LoginInput) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (user.passwordHash === null) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const validPassword = await verifyPassword(
    user.passwordHash,
    input.password,
  );

  if (!validPassword) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET_MISSING");
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    secret,
    {
      expiresIn: "7d",
    },
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
}