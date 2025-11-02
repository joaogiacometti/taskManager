"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CheckSquare, BarChart3, FolderKanban } from "lucide-react";

export const Navigation = () => {
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: BarChart3,
    },
    {
      href: "/projects",
      label: "Projetos",
      icon: FolderKanban,
    },
    {
      href: "/tasks",
      label: "Tarefas",
      icon: CheckSquare,
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex gap-6">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 py-4 border-b-2 transition-colors",
                  isActive
                    ? "border-blue-500 text-blue-600 font-semibold"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
