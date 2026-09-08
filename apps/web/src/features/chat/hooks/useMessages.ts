import { useQuery } from "@tanstack/react-query";

import { getMessages } from "@/services/chat.service.js";

export function useMessages(
  workspaceId: string,
  chatId: string,
) {
  return useQuery({
    queryKey: [
      "messages",
      workspaceId,
      chatId,
    ],

    queryFn: () =>
      getMessages(
        workspaceId,
        chatId,
      ),

    enabled:
      Boolean(workspaceId) &&
      Boolean(chatId),
  });
}