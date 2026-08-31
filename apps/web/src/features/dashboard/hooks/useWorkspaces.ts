import { useQuery } from "@tanstack/react-query";

import { getWorkspaces } from "@/services/workspace.service.js";

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });
}