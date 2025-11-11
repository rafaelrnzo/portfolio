"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "./shared/container";

const NAV_ITEMS = {
  about: "/",
  project: "/project",
  blog: "/blog",
  // thoughts: "/thoughts",
  experience: "/experience",
};

export const Header = () => {
  const pathname = usePathname();

  return (
    <header>
      <Container size="large">
        <nav
          className="flex flex-col fade items-center md:items-start justify-start py-12 tracking-tight w-full"
          aria-label="Main navigation"
        >
          <div className="flex flex-col items-start">
            <span className="text-lg font-medium">Rafael Lorenzo</span>
            <span className="text-md opacity-50">software developer</span>
          </div>

          <div className="flex flex-row items-center justify-start w-full mt-12 sm:mt-6 tracking-tight">
            <div className="inline-flex items-center gap-1">
              {Object.entries(NAV_ITEMS).map(([name, href]) => (
                <Link
                  key={name}
                  href={href}
                  className={cn(
                    pathname === href ? "opacity-100" : "opacity-50",
                    "transition-opacity hover:opacity-100 py-1 px-2 first:pl-0 text-[15px]"
                  )}
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
};
