import { useQuery } from "@tanstack/react-query";

import { getChats } from "@/services/chat.service.js";

export function useChats(workspaceId: string) {
  return useQuery({
    queryKey: ["chats", workspaceId],
    queryFn: () => getChats(workspaceId),
    enabled: Boolean(workspaceId),
  });
}