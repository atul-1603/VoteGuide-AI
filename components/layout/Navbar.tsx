"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Vote, Globe, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { changeLanguage } from "@/components/layout/GoogleTranslate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { usePathname } from "next/navigation";

export function Navbar() {
  const { user, logOut } = useAuthStore();
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", protected: true },
    { href: "/timeline", label: "Timeline" },
    { href: "/chat", label: "AI Chat" },
    { href: "/find-station", label: "Find Station" },
    { href: "/journey", label: "My Journey" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-md notranslate">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary font-serif text-2xl font-bold">
          <Vote className="h-6 w-6" />
          <span>VoteGuide</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            if (link.protected && !user) return null;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"} transition-colors`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem className="cursor-pointer" onClick={() => changeLanguage("en")}>
                English (EN)
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => changeLanguage("hi")}>
                Hindi (HI)
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => changeLanguage("mr")}>
                Marathi (MR)
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => changeLanguage("ta")}>
                Tamil (TA)
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => changeLanguage("bn")}>
                Bengali (BN)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 border border-white/10">
                    <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                    <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.displayName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/journey" className="cursor-pointer">My Journey</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuItem className="text-destructive cursor-pointer" onClick={logOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-white font-semibold">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
