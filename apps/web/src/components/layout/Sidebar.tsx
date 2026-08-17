import { NavLink } from "react-router-dom";
import {
  BookOpen,
  FileText,
  MessageSquare,
  NotebookPen,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const navigation = [
  {
    label: "Chat",
    icon: MessageSquare,
    path: "/chat",
  },
  {
    label: "Documents",
    icon: FileText,
    path: "/documents",
  },
  {
    label: "Notes",
    icon: NotebookPen,
    path: "/notes",
  },
  {
    label: "Research",
    icon: Search,
    path: "/research",
  },
];

function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2 border-b px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </div>

        <span className="text-lg font-semibold tracking-tight">
          Stud.xo
        </span>
      </div>

      {/* Workspace */}
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
        >
          <BookOpen className="size-4" />

          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">
              My Workspace
            </span>

            <span className="text-xs text-muted-foreground">
              Personal
            </span>
          </div>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
  {navigation.map((item) => {
    const Icon = item.icon;

    return (
      <Button
        key={item.label}
        variant="ghost"
        className="w-full justify-start gap-3"
        asChild
      >
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            [
              "transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")
          }
        >
          <Icon className="size-4" />
          <span>{item.label}</span>
        </NavLink>
      </Button>
    );
  })}
</nav>

      {/* Bottom */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
        >
          <Settings className="size-4" />
          Settings
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;