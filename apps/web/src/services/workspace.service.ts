import api from "@/lib/api.js";

export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  role: "owner" | "member";
}

export interface CreateWorkspaceInput {
  name: string;
}

export interface WorkspaceResponse {
  workspace: Workspace;
}

export interface WorkspacesResponse {
  workspaces: Workspace[];
}


// ==========================================
// GET USER WORKSPACES
// ==========================================

export async function getWorkspaces(): Promise<
  WorkspacesResponse
> {
  const response =
    await api.get<WorkspacesResponse>(
      "/workspaces",
    );

  return response.data;
}


// ==========================================
// GET SINGLE WORKSPACE
// ==========================================

export async function getWorkspace(
  workspaceId: string,
): Promise<WorkspaceResponse> {
  const response =
    await api.get<WorkspaceResponse>(
      `/workspaces/${workspaceId}`,
    );

  return response.data;
}


// ==========================================
// CREATE WORKSPACE
// ==========================================

export async function createWorkspace(
  data: CreateWorkspaceInput,
): Promise<WorkspaceResponse & { message: string }> {
  const response =
    await api.post<
      WorkspaceResponse & { message: string }
    >("/workspaces", data);

  return response.data;
}


// ==========================================
// UPDATE WORKSPACE
// ==========================================

export async function updateWorkspace(
  workspaceId: string,
  data: CreateWorkspaceInput,
): Promise<WorkspaceResponse & { message: string }> {
  const response =
    await api.patch<
      WorkspaceResponse & { message: string }
    >(
      `/workspaces/${workspaceId}`,
      data,
    );

  return response.data;
}


// ==========================================
// DELETE WORKSPACE
// ==========================================

export async function deleteWorkspace(
  workspaceId: string,
): Promise<void> {
  await api.delete(
    `/workspaces/${workspaceId}`,
  );
}