import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createChat,
  type CreateChatInput,
} from "@/services/chat.service.js";

export function useCreateChat(
  workspaceId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateChatInput,
    ) =>
      createChat(
        workspaceId,
        data,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "chats",
          workspaceId,
        ],
      });
    },
  });
}