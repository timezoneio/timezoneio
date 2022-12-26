import moment from "moment-timezone";

import { User } from "@prisma/client";

function getUTCOffset(tz: string) {
  return moment().tz(tz).utcOffset();
}

export type TimezoneGroup = {
  utcOffset: number;
  people: User[];
};

export function groupByTimezones(users: User[]): TimezoneGroup[] {
  const groups = users
    .map((u) => {
      return { ...u, utcOffset: getUTCOffset(u.tz) };
    })
    .reduce<{ [key: number]: TimezoneGroup }>((acc, u) => {
      const utcOffset = u.utcOffset || 0;
      if (acc.hasOwnProperty(utcOffset)) {
        acc[utcOffset]?.people.push(u);
      } else {
        acc[utcOffset] = {
          utcOffset: utcOffset,
          people: [u],
        };
      }
      return acc;
    }, {});
  return Object.values(groups).sort((a, b) => a.utcOffset - b.utcOffset);
}
