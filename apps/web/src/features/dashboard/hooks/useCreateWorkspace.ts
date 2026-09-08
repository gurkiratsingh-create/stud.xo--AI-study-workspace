import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createWorkspace,
} from "@/services/workspace.service.js";

import type { CreateWorkspaceInput } from "@/services/workspace.service.js";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceInput) =>
      createWorkspace(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
  });
}