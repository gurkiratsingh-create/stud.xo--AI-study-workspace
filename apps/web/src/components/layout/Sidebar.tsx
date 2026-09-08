import { NavLink, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  FileText,
  MessageSquare,
  NotebookPen,
  Plus,
  Search,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWorkspaces } from "@/features/dashboard/hooks/useWorkspaces";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    data: workspaceData,
    isLoading: workspacesLoading,
  } = useWorkspaces();

  /*
   * Extract workspace ID from the current URL.
   *
   * Example:
   *
   * /dashboard
   * → undefined
   *
   * /workspaces/abc/notes
   * → abc
   */
  const workspaceMatch = location.pathname.match(
    /^\/workspaces\/([^/]+)/,
  );

  const workspaceId = workspaceMatch?.[1];

  const currentWorkspace =
    workspaceData?.workspaces.find(
      (workspace) => workspace.id === workspaceId,
    );

  function openWorkspace(id: string) {
    navigate(`/workspaces/${id}/notes`);
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r bg-background">
      {/* ==========================================
          BRAND
      ========================================== */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b px-5">
  <img
    src="/studxo-mark.png"
    alt="Stud.xo"
    className="size-10 object-contain"
  />

  <span className="text-lg font-semibold tracking-tight">
    Stud.xo
  </span>
</div>

      {/* ==========================================
          SCROLLABLE SIDEBAR CONTENT
      ========================================== */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
        {/* Dashboard */}
        <div className="p-3">
          {workspaceId ? (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              asChild
            >
              <NavLink to="/dashboard">
                <ArrowLeft className="size-4" />
                <span>Dashboard</span>
              </NavLink>
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
              asChild
            >
              <NavLink to="/dashboard">
                <BookOpen className="size-4" />
                <span>Dashboard</span>
              </NavLink>
            </Button>
          )}
        </div>

        {/* ========================================
            WORKSPACES
        ======================================== */}
        <section className="px-3">
          <div className="mb-2 flex items-center justify-between px-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Workspaces
            </span>

            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => navigate("/dashboard?create=true")}
              title="Create workspace"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>

          {/* Workspace list has its own scroll */}
          <div className="max-h-56 space-y-1 overflow-y-auto pr-1 scrollbar-thin">
            {workspacesLoading && (
              <>
                <div className="h-9 animate-pulse rounded-lg bg-muted/50" />
                <div className="h-9 animate-pulse rounded-lg bg-muted/50" />
                <div className="h-9 animate-pulse rounded-lg bg-muted/50" />
              </>
            )}

            {!workspacesLoading &&
              workspaceData?.workspaces.map(
                (workspace) => {
                  const isActive =
                    workspace.id === workspaceId;

                  return (
                    <button
                      key={workspace.id}
                      type="button"
                      onClick={() =>
                        openWorkspace(workspace.id)
                      }
                      className={[
                        "group flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-all",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      {/* Workspace icon */}
                      <div
                        className={[
                          "flex size-7 shrink-0 items-center justify-center rounded-md transition-colors",
                          isActive
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-muted-foreground group-hover:bg-background",
                        ].join(" ")}
                      >
                        <BookOpen className="size-3.5" />
                      </div>

                      {/* Workspace name */}
                      <span className="min-w-0 flex-1 truncate">
                        {workspace.name}
                      </span>

                      {/* Active indicator */}
                      {isActive && (
                        <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                },
              )}

            {!workspacesLoading &&
              !workspaceData?.workspaces.length && (
                <div className="rounded-lg border border-dashed px-3 py-3">
                  <p className="text-xs text-muted-foreground">
                    No workspaces yet.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/dashboard?create=true")
                    }
                    className="mt-1 text-xs font-medium text-primary hover:underline"
                  >
                    Create one →
                  </button>
                </div>
              )}
          </div>
        </section>

        {/* ========================================
            CURRENT WORKSPACE
        ======================================== */}
        {workspaceId && (
          <>
            <div className="mx-3 my-4 border-t" />

            <section className="px-3">
              <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <BookOpen className="size-3.5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {currentWorkspace?.name ??
                        "Workspace"}
                    </p>

                    <p className="text-[11px] text-muted-foreground">
                      {currentWorkspace?.role ??
                        "Workspace"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ======================================
                WORKSPACE FEATURES
            ====================================== */}
            <section className="mt-4 px-3 pb-4">
              <div className="mb-2 px-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Workspace
                </span>
              </div>

              {/* Feature navigation can scroll independently */}
              <nav className="max-h-64 space-y-1 overflow-y-auto pr-1 scrollbar-thin">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  asChild
                >
                  <NavLink
                    to={`/workspaces/${workspaceId}/chat`}
                    className={({ isActive }) =>
                      [
                        "transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      ].join(" ")
                    }
                  >
                    <MessageSquare className="size-4" />
                    <span>Chat</span>
                  </NavLink>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  asChild
                >
                  <NavLink
                    to={`/workspaces/${workspaceId}/documents`}
                    className={({ isActive }) =>
                      [
                        "transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      ].join(" ")
                    }
                  >
                    <FileText className="size-4" />
                    <span>Documents</span>
                  </NavLink>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  asChild
                >
                  <NavLink
                    to={`/workspaces/${workspaceId}/notes`}
                    className={({ isActive }) =>
                      [
                        "transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      ].join(" ")
                    }
                  >
                    <NotebookPen className="size-4" />
                    <span>Notes</span>
                  </NavLink>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  asChild
                >
                  <NavLink
                    to={`/workspaces/${workspaceId}/research`}
                    className={({ isActive }) =>
                      [
                        "transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      ].join(" ")
                    }
                  >
                    <Search className="size-4" />
                    <span>Research</span>
                  </NavLink>
                </Button>
              </nav>
            </section>
          </>
        )}
      </div>

      {/* ==========================================
          SETTINGS — ALWAYS FIXED AT BOTTOM
      ========================================== */}
      <div className="shrink-0 border-t bg-background p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Settings className="size-4" />
          <span>Settings</span>
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;