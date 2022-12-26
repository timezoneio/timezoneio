import { User } from "@prisma/client";

export function getMostPopularCity(people: User[]): string {
  const cityCounts = people
    .map((p) => p.location)
    .filter((l) => !!l)
    .reduce((acc, l) => {
      if (acc[l]) {
        acc[l] += 1;
      } else {
        acc[l] = 1;
      }
      return acc;
    }, {});

  const city = Object.keys(cityCounts).reduce(
    (acc, k) => {
      if (cityCounts[k] > acc.value) {
        return { name: k, value: cityCounts[k] };
      }
      return acc;
    },
    { name: "", value: 0 }
  );

  return city.name;
}
