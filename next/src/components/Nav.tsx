import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/team/buffer", text: "Live Demo" },
  { href: "https://github.com/timezoneio/timezoneio", text: "Open Source" },
];

const loginURL = "/login";

type Props = {
  team?: string;
  time?: string;
};

export default function Nav({ team, time }: Props) {
  const [isOpen, setOpen] = useState<boolean>(false);
  return (
    <div className="px-6 pt-6 lg:px-8">
      <div>
        <nav
          className="flex h-9 items-center justify-between"
          aria-label="Global"
        >
          <div
            className="flex items-center lg:min-w-0 lg:flex-1"
            aria-label="Global"
          >
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Timezone.io</span>
              <Image
                width={32}
                height={32}
                className="h-8"
                src="/static/brand/icon-192.png"
                alt="Timezone.io Logo"
              />
            </Link>
            {team && <h1 className="ml-3 text-lg font-medium">{team}</h1>}
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:min-w-0 lg:flex-1 lg:justify-center lg:gap-x-12">
            {time ? (
              <div className="text-lg font-medium">{time}</div>
            ) : (
              links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="font-semibold text-gray-900 hover:text-gray-900"
                >
                  {l.text}
                </Link>
              ))
            )}
          </div>
          <div className="hidden lg:flex lg:min-w-0 lg:flex-1 lg:justify-end">
            <a
              href={loginURL}
              className="inline-block rounded-lg px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20"
            >
              Log in
            </a>
          </div>
        </nav>
        {isOpen && (
          <div role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-10 overflow-y-auto bg-white px-6 py-6 lg:hidden">
              <div className="flex h-9 items-center justify-between">
                <div className="flex">
                  <Link href="/" className="-m-1.5 p-1.5">
                    <span className="sr-only">Timezone.io</span>
                    <Image
                      width={32}
                      height={32}
                      className="h-8"
                      src="/static/brand/icon-192.png"
                      alt="Timezone.io Logo"
                    />
                  </Link>
                </div>
                <div className="flex">
                  <button
                    type="button"
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10"
                      >
                        {l.text}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    <a
                      href={loginURL}
                      className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-400/10"
                    >
                      Log in
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
