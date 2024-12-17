"use client";

import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  MessageSquare,
  Key,
  Settings,
  LogOut,
  Users,
  PersonStanding,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Tech Stacks", href: "/admin/stacks", icon: Layers },
  { name: "Discord Servers", href: "/admin/discord", icon: MessageSquare },
  { name: "JetBrains Licenses", href: "/admin/licenses", icon: Key },
  { name: "Configuration", href: "/admin/config", icon: Settings },
  { name: "Administrators", href: "/admin/admins", icon: Users },
  { name: "Participants", href: "/admin/participants", icon: PersonStanding },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Logout failed");

      // Force a hard navigation to login page to clear all state
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Don't show admin layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin/dashboard">
                  <Logo className="h-8 w-auto" />
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <aside className="w-64 bg-white rounded-lg shadow-sm h-fit">
            <nav className="space-y-1 p-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5",
                        isActive ? "text-white" : "text-gray-400"
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1 bg-white rounded-lg shadow-sm p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
