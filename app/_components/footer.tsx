import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Logo markClassName="size-6" />
          <span className="font-normal text-muted-foreground">— learn at your own pace</span>
        </div>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/library" className="hover:text-foreground">Library</Link>
          <Link href="/add" className="hover:text-foreground">Add video</Link>
          <Link href="/settings" className="hover:text-foreground">Settings</Link>
        </nav>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Chapterly. All rights reserved.</p>
      </div>
    </footer>
  );
}
