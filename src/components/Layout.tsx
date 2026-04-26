import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Stack Template. Built with React, Vite &
        Supabase.
      </footer>
    </div>
  );
}
