import type { User } from "@prisma/client";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

// Exclude keys from user
export function userExclude<User, Key extends keyof User>(
  user: User,
  keys: Key[]
): Omit<User, Key> {
  for (const key of keys) {
    delete user[key];
  }
  return user;
}

export function cleanUser(
  user: User
): Omit<User, "inviteCode" | "hashedPassword" | "coords" | "email"> {
  return userExclude(user, ["inviteCode", "hashedPassword", "coords", "email"]);
}

export const userRouter = router({
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        id: input,
      },
    });
    if (user) {
      return cleanUser(user);
    }
    return user;
  }),
});
