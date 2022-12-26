import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { signIn, signOut, useSession } from "next-auth/react";

import Nav from "src/components/Nav";

const Login: NextPage = () => {
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
        className="isolate h-full bg-white"
        style={{
          backgroundImage: `radial-gradient(circle at 34% 290px, rgb(196 208 241 / 70%) 0, transparent 45%, transparent 100%)`,
        }}
      >
        <Nav />

        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <Image
                width={32}
                height={32}
                className="mx-auto h-12 w-auto"
                src="/static/brand/icon-192.png"
                alt="Timezone.io Logo"
              />
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Sign in to your account
              </h2>
              <div className="my-8 mx-auto max-w-md">
                <h2 className="mb-8 font-medium">
                  Timezone.io is undergoing maintenance and will be back up as
                  soon as possible!
                </h2>
                <p>
                  Due to Timezone being a free service that is maintained by a
                  single individual, it may take a few days to return. No data
                  has been lost, maintenance needs to be performed to continue
                  running Timezone.io. Thanks for your patience!
                </p>
              </div>
              {/*<p className="mt-2 text-center text-sm text-gray-600">
                Or{" "}
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  create your free account today
                </a>
      </p>*/}
            </div>
            <form className="mt-8 space-y-6" action="#" method="POST">
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="-space-y-px rounded-md shadow-sm">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    disabled={true}
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    disabled={true}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-sky-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  disabled={true}
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-700 py-2 px-4 text-sm font-medium text-white hover:bg-sky-600 focus:outline-none"
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockClosedIcon
                      className="h-5 w-5 text-sky-200 group-hover:text-sky-100"
                      aria-hidden="true"
                    />
                  </span>
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
