import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Logo } from "@/components/Logo";
import { AddVideoButton, NavLinks } from "@/components/NavLinks";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="hidden font-normal text-muted-foreground md:inline">
            YouTube timestamps → course
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <NavLinks />
          <AddVideoButton />
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
