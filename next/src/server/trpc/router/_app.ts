import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { teamRouter } from "./team";

export const appRouter = router({
  user: userRouter,
  team: teamRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
