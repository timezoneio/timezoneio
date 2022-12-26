import type { User } from "@prisma/client";

export function getMostPopularCity(people: User[]): string {
  const cityCounts = people
    .map((p) => p.location)
    .filter((l) => !!l)
    .reduce<{ [key: string]: number }>((acc, l) => {
      if (!l) {
        return acc;
      }
      if (acc.hasOwnProperty(l)) {
        acc[l] += 1;
      } else {
        acc[l] = 1;
      }
      return acc;
    }, {});

  const city = Object.keys(cityCounts).reduce<{ name: string; value: number }>(
    (acc, k) => {
      if (cityCounts && (cityCounts[k] || 0) > acc.value) {
        return { name: k, value: cityCounts[k] || 0 };
      }
      return acc;
    },
    { name: "", value: 0 }
  );

  return city.name;
}
