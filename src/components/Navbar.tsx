import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="text-primary">⚡</span>
          Stack Template
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">Home</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <Separator orientation="vertical" className="h-5" />
          <Button size="sm" variant="outline" asChild>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
            >
              Supabase
            </a>
          </Button>
          <Button size="sm">Get Started</Button>
        </div>
      </div>
    </header>
  );
}
