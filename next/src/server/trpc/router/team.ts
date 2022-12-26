import type { Team, TeamMember } from "@prisma/client";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";
import { groupByTimezones } from "src/utils/transform";
import { cleanUser } from "./user";

function teamExclude<Team, Key extends keyof Team>(
  t: Team,
  keys: Key[]
): Omit<Team, Key> {
  for (const key of keys) {
    delete t[key];
  }
  return t;
}

export const teamRouter = router({
  getBySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const team = await ctx.prisma.team.findFirst({
      where: {
        slug: input,
      },
      include: {
        TeamMember: {
          include: {
            member: true,
          },
        },
      },
    });

    if (team?.id) {
      const users = team.TeamMember.map((tm) => tm.member);
      const people = users.map((u) => cleanUser(u));
      return {
        ...teamExclude(team, ["inviteHash", "TeamMember"]),
        people,
        timezones: groupByTimezones(users),
      };

      return;
    }
    return team;
  }),
});
