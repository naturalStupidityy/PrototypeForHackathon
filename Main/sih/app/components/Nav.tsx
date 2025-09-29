"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { Menu, X } from "lucide-react";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  function close() {
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-colors ${scrolled ? "bg-background/80 backdrop-blur border-b" : "bg-transparent"}`}>
      <div className="mx-auto w-full max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="#" className="font-bold text-lg">NAMASTE-FHIR</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm" aria-label="Primary">
          <a href="#overview" className="hover:underline">Overview</a>
          <a href="#docs" className="hover:underline">Docs</a>
          <a href="#compliance" className="hover:underline">Compliance</a>
          <a href="#security" className="hover:underline">Security</a>
          <a href="#mapping-interface" className="hover:underline">Mapping</a>
          <a href="#api" className="hover:underline">API</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
        </div>
        <button
          className="md:hidden inline-flex items-center rounded-md border px-3 py-2 text-sm"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          <span className="sr-only">Toggle menu</span>
        </button>
      </div>
      {open && (
        <div id="mobile-menu" className="md:hidden border-t">
          <nav className="mx-auto w-full max-w-6xl px-4 py-3 grid gap-2 text-sm" aria-label="Mobile">
            <a href="#overview" onClick={close} className="py-1">Overview</a>
            <a href="#docs" onClick={close} className="py-1">Docs</a>
            <a href="#compliance" onClick={close} className="py-1">Compliance</a>
            <a href="#security" onClick={close} className="py-1">Security</a>
            <a href="#mapping-interface" onClick={close} className="py-1">Mapping</a>
            <a href="#api" onClick={close} className="py-1">API</a>
            <a href="#contact" onClick={close} className="py-1">Contact</a>
            <div className="pt-2"><ThemeToggle /></div>
          </nav>
        </div>
      )}
    </header>
  );
}


