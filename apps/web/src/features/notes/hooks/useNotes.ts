import { useQuery } from "@tanstack/react-query";

import { getNotes } from "@/services/notes.service.js";

export function useNotes(
  workspaceId: string,
) {
  return useQuery({
    queryKey: ["notes", workspaceId],
    queryFn: () =>
      getNotes(workspaceId),
    enabled: Boolean(workspaceId),
  });
}