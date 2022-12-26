import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

import Nav from "src/components/Nav";

const Home: NextPage = () => {
  const userQuery = trpc.user.getById.useQuery("56435b8c4159630508317092");

  const teamQuery = trpc.team.getBySlug.useQuery("buffer");

  const user = userQuery.data;
  console.log(userQuery.data, teamQuery.data);

  return (
    <>
      <Head>
        <title>Timezone.io</title>
        <meta
          name="description"
          content="Easily compare local times for your entire remote team"
        />
      </Head>
      <div
        className="isolate bg-white"
        style={{
          backgroundImage: `radial-gradient(circle at 34% 290px, rgb(196 208 241 / 70%) 0, transparent 45%, transparent 100%)`,
        }}
      >
        <Nav />

        <main>
          <div className="relative px-6 lg:px-8">
            <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
              <div>
                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                  <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                    <span className="text-gray-600">
                      We're working on some maintenance and will be back online
                      ASAP!{" "}
                      {/* <a href="#" className="font-semibold text-sky-700">
                        <span
                          className="absolute inset-0"
                          aria-hidden="true"
                        ></span>
                        Read more <span aria-hidden="true">&rarr;</span>
                      </a> */}
                    </span>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                    Easily compare local times for your entire remote team
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                    The simplest way to display and compare local times for your
                    globally distributed team.
                  </p>
                  <div className="mt-8 flex gap-x-4 sm:justify-center">
                    {/* <a
                      href="/login"
                      className="inline-block rounded-lg bg-sky-700 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-sky-600"
                    >
                      Get started{" "}
                      <span className="text-sky-200" aria-hidden="true">
                        &rarr;
                      </span>
                    </a> */}
                    <a
                      href="/team/buffer"
                      className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 text-gray-900 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                    >
                      Live demo{" "}
                      <span className="text-gray-400" aria-hidden="true">
                        &rarr;
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-md">
            <h2 className="mb-8 font-medium">
              Timezone.io is undergoing maintenance and will be back up as soon
              as possible!
            </h2>
            <p>
              Due to Timezone being a free service that is maintained by a
              single individual, it may take a few days to return. No data has
              been lost, maintenance needs to be performed to continue running
              Timezone.io. Thanks for your patience!
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
