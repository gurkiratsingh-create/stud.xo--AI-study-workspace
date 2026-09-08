import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  sendMessage,
  type SendMessageInput,
} from "@/services/chat.service.js";

export function useSendMessage(
  workspaceId: string,
  chatId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: SendMessageInput,
    ) =>
      sendMessage(
        workspaceId,
        chatId,
        data,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "messages",
          workspaceId,
          chatId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "chats",
          workspaceId,
        ],
      });
    },
  });
}