import { useState } from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useWorkspaces } from "@/features/dashboard/hooks/useWorkspaces";
import { useCreateWorkspace } from "@/features/dashboard/hooks/useCreateWorkspace";

function DashboardPage() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const {
    data: workspaceData,
    isLoading: workspacesLoading,
    isError: workspacesError,
  } = useWorkspaces();

  const createWorkspaceMutation =
    useCreateWorkspace();

  const [workspaceName, setWorkspaceName] =
    useState("");

  const showCreateForm =
    searchParams.get("create") === "true";

  async function handleCreateWorkspace(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const name = workspaceName.trim();

    if (!name) {
      return;
    }

    try {
      const response =
        await createWorkspaceMutation.mutateAsync({
          name,
        });

      setWorkspaceName("");
      setSearchParams({});

      /*
       * Automatically open the newly created workspace.
       */
      navigate(
        `/workspaces/${response.workspace.id}/notes`,
      );
    } catch (error) {
      console.error(
        "Create workspace error:",
        error,
      );
    }
  }

  function toggleCreateForm() {
    if (showCreateForm) {
      setSearchParams({});
    } else {
      setSearchParams({ create: "true" });
    }
  }

  return (
    <div className="space-y-8 p-8">
      {/* ==========================================
          HEADER
      ========================================== */}
      <div>
        <p className="text-sm text-muted-foreground">
          Your learning workspace
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Welcome back 👋
        </h1>

        <p className="mt-2 text-muted-foreground">
          Choose a workspace to continue learning.
        </p>
      </div>

      {/* ==========================================
          WORKSPACE HEADER
      ========================================== */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            Your Workspaces
          </h2>

          <p className="text-sm text-muted-foreground">
            Select a workspace to open your learning
            tools.
          </p>
        </div>

        <Button onClick={toggleCreateForm}>
          {showCreateForm
            ? "Cancel"
            : "+ Create Workspace"}
        </Button>
      </div>

      {/* ==========================================
          CREATE WORKSPACE
      ========================================== */}
      {showCreateForm && (
        <form
          onSubmit={handleCreateWorkspace}
          className="rounded-xl border bg-card p-6"
        >
          <div className="space-y-2">
            <label
              htmlFor="workspace-name"
              className="text-sm font-medium"
            >
              Workspace name
            </label>

            <Input
              id="workspace-name"
              value={workspaceName}
              onChange={(event) =>
                setWorkspaceName(event.target.value)
              }
              placeholder="e.g. AI Research"
              disabled={
                createWorkspaceMutation.isPending
              }
              autoFocus
            />
          </div>

          {createWorkspaceMutation.isError && (
            <p className="mt-2 text-sm text-red-500">
              Failed to create workspace.
            </p>
          )}

          <Button
            type="submit"
            className="mt-4"
            disabled={
              createWorkspaceMutation.isPending ||
              !workspaceName.trim()
            }
          >
            {createWorkspaceMutation.isPending
              ? "Creating..."
              : "Create Workspace"}
          </Button>
        </form>
      )}

      {/* ==========================================
          LOADING
      ========================================== */}
      {workspacesLoading && (
        <p className="text-sm text-muted-foreground">
          Loading workspaces...
        </p>
      )}

      {/* ==========================================
          ERROR
      ========================================== */}
      {workspacesError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <p className="font-medium text-red-500">
            Failed to load workspaces.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please refresh the page or log in again.
          </p>
        </div>
      )}

      {/* ==========================================
          EMPTY STATE
      ========================================== */}
      {workspaceData &&
        workspaceData.workspaces.length === 0 && (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <h2 className="font-semibold">
              No workspaces yet
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Create your first workspace to get
              started.
            </p>

            <Button
              className="mt-4"
              onClick={() =>
                setSearchParams({
                  create: "true",
                })
              }
            >
              Create Workspace
            </Button>
          </div>
        )}

      {/* ==========================================
          WORKSPACE CARDS
      ========================================== */}
      {workspaceData &&
        workspaceData.workspaces.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {workspaceData.workspaces.map(
              (workspace) => (
                <Link
                  key={workspace.id}
                  to={`/workspaces/${workspace.id}/notes`}
                  className="group rounded-xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:bg-muted/50 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <span className="text-lg">
                        📚
                      </span>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {workspace.role}
                    </span>
                  </div>

                  <h3 className="mt-5 font-semibold group-hover:text-primary">
                    {workspace.name}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Open workspace →
                  </p>

                  <p className="mt-4 text-xs text-muted-foreground">
                    Created{" "}
                    {new Date(
                      workspace.createdAt,
                    ).toLocaleDateString()}
                  </p>
                </Link>
              ),
            )}
          </div>
        )}
    </div>
  );
}

export default DashboardPage;