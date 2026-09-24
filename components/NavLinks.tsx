"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "/#features", label: "Features", className: "hidden sm:inline-flex", match: (p: string, h: string) => p === "/" && h === "#features" },
  { href: "/#how", label: "How it works", className: "hidden sm:inline-flex", match: (p: string, h: string) => p === "/" && h === "#how" },
  {
    href: "/library",
    label: "Library",
    className: undefined as string | undefined,
    match: (p: string) => p === "/library" || p.startsWith("/course"),
  },
  { href: "/settings", label: "Settings", className: "hidden sm:inline-flex", match: (p: string) => p === "/settings" },
];

export function NavLinks() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  return (
    <>
      {LINKS.map((l) => {
        const active = l.match(pathname, hash);
        return (
          <Button
            key={l.href}
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href={l.href} aria-current={active ? "page" : undefined} />}
            className={cn(
              l.className,
              active && "bg-muted font-medium text-foreground"
            )}
          >
            {l.label}
          </Button>
        );
      })}
    </>
  );
}

export function AddVideoButton() {
  const pathname = usePathname();
  const active = pathname === "/add";
  return (
    <Button
      size="sm"
      nativeButton={false}
      render={<Link href="/add" aria-current={active ? "page" : undefined} />}
      className={cn(active && "ring-2 ring-violet-600/40")}
    >
      + Add video
    </Button>
  );
}
