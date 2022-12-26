import { type NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { trpc } from "src/utils/trpc";
import type { TimezoneGroup } from "src/utils/transform";
import { getMostPopularCity } from "src/utils/groups";
import Nav from "src/components/Nav";
import Avatar from "src/components/Avatar";

dayjs.extend(utc);

const Team: NextPage = () => {
  const { query } = useRouter();
  const slug = Array.isArray(query.slug) ? query.slug[0] : query.slug;
  const teamQuery = trpc.team.getBySlug.useQuery(slug || "");
  const team = teamQuery.data;
  const timezones: TimezoneGroup[] = team?.timezones || [];
  console.log(timezones);

  const time = dayjs();
  const format = "h:MM a";

  return (
    <>
      <Head>
        <title>{team?.name || "Team Not found"} - Timezone.io</title>
        <meta name="description" content={`${team?.name} on Timezone.io`} />
      </Head>
      <main>
        <Nav team={team?.name} time={time.format(format)} />

        <div className="flex-cols flex justify-center gap-4 px-6 py-6">
          {timezones.map((t) => (
            <div key={t.utcOffset} className="w-24 text-center">
              <h2 className="font-medium">
                {dayjs().utcOffset(t.utcOffset).format(format)}
              </h2>
              <p className="mw-full h-5 truncate text-xs text-slate-500">
                {getMostPopularCity(t.people)}
              </p>
              <div className="mt-4">
                {t.people.map((p) => (
                  <div key={p.id} className="my-2">
                    <Avatar
                      src={p.avatar || ""}
                      height={64}
                      width={64}
                      alt={`${p.name}'s avatar`}
                      title={p.name || ""}
                      className="mx-auto h-16 w-16 rounded-full"
                    />
                    <div className="mt-1 h-5 overflow-hidden text-ellipsis text-sm text-slate-600">
                      {p.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Team;
