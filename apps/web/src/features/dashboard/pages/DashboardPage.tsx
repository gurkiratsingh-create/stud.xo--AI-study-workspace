import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useHealth } from "@/features/dashboard/hooks/useHealth";
import { useWorkspaces } from "@/features/dashboard/hooks/useWorkspaces";
import { useCreateWorkspace } from "@/features/dashboard/hooks/useCreateWorkspace";

function DashboardPage() {
  const {
    data: healthData,
    isLoading: healthLoading,
    isError: healthError,
  } = useHealth();

  const {
    data: workspaceData,
    isLoading: workspacesLoading,
    isError: workspacesError,
  } = useWorkspaces();

  const createWorkspaceMutation =
    useCreateWorkspace();

  const [workspaceName, setWorkspaceName] =
    useState("");

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  async function handleCreateWorkspace(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const name = workspaceName.trim();

    if (!name) {
      return;
    }

    try {
      await createWorkspaceMutation.mutateAsync({
        name,
      });

      setWorkspaceName("");
      setShowCreateForm(false);
    } catch (error) {
      console.error(
        "Create workspace error:",
        error,
      );
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
          What do you want to learn today?
        </p>
      </div>


      {/* ==========================================
          API STATUS
      ========================================== */}

      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold">
          API Status
        </h2>

        {healthLoading && (
          <p className="mt-2 text-sm text-muted-foreground">
            Checking API...
          </p>
        )}

        {healthError && (
          <p className="mt-2 text-sm text-red-500">
            API unavailable
          </p>
        )}

        {healthData && (
          <p className="mt-2 text-sm text-green-500">
            {healthData.service} —{" "}
            {healthData.status}
          </p>
        )}
      </div>


      {/* ==========================================
          WORKSPACES
      ========================================== */}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Your Workspaces
            </h2>

            <p className="text-sm text-muted-foreground">
              Workspaces you belong to.
            </p>
          </div>

          <Button
            onClick={() =>
              setShowCreateForm(
                !showCreateForm,
              )
            }
          >
            {showCreateForm
              ? "Cancel"
              : "+ Create Workspace"}
          </Button>
        </div>


        {/* ========================================
            CREATE WORKSPACE FORM
        ======================================== */}

        {showCreateForm && (
          <form
            onSubmit={handleCreateWorkspace}
            className="mb-6 rounded-xl border bg-card p-6"
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
                  setWorkspaceName(
                    event.target.value,
                  )
                }
                placeholder="e.g. AI Research"
                disabled={
                  createWorkspaceMutation.isPending
                }
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


        {/* ========================================
            LOADING
        ======================================== */}

        {workspacesLoading && (
          <p className="text-sm text-muted-foreground">
            Loading workspaces...
          </p>
        )}


        {/* ========================================
            ERROR
        ======================================== */}

        {workspacesError && (
          <p className="text-sm text-red-500">
            Failed to load workspaces.
          </p>
        )}


        {/* ========================================
            EMPTY STATE
        ======================================== */}

        {workspaceData &&
          workspaceData.workspaces.length ===
            0 && (
            <div className="rounded-xl border border-dashed p-6">
              <p className="font-medium">
                No workspaces yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Create a workspace to get started.
              </p>
            </div>
          )}


        {/* ========================================
            WORKSPACE CARDS
        ======================================== */}

        {workspaceData &&
          workspaceData.workspaces.length >
            0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {workspaceData.workspaces.map(
                (workspace) => (
                  <div
                    key={workspace.id}
                    className="rounded-xl border bg-card p-6"
                  >
                    <h3 className="font-semibold">
                      {workspace.name}
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Role: {workspace.role}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Created{" "}
                      {new Date(
                        workspace.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                ),
              )}
            </div>
          )}
      </div>


      {/* ==========================================
          FEATURES
      ========================================== */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold">
            AI Chat
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Ask questions and learn with your AI
            assistant.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold">
            Documents
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Upload and learn from your study
            material.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold">
            Research
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Search, understand and organize
            knowledge.
          </p>
        </div>

      </div>

    </div>
  );
}

export default DashboardPage;