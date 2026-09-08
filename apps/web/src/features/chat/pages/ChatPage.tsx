import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import {
  MessageSquare,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useWorkspaces } from "@/features/dashboard/hooks/useWorkspaces";

import { useChats } from "@/features/chat/hooks/useChats";
import { useMessages } from "@/features/chat/hooks/useMessages";
import { useCreateChat } from "@/features/chat/hooks/useCreateChat";
import { useSendMessage } from "@/features/chat/hooks/useSendMessage";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatPage() {
  const { workspaceId } =
    useParams<{ workspaceId: string }>();

  const {
    data: workspaceData,
    isLoading: workspacesLoading,
  } = useWorkspaces();

  const workspace =
    workspaceData?.workspaces.find(
      (item) => item.id === workspaceId,
    );

  const {
    data: chatsData,
    isLoading: chatsLoading,
    isError: chatsError,
  } = useChats(workspaceId ?? "");

  const chats = chatsData?.chats ?? [];

  const [selectedChatId, setSelectedChatId] =
    useState("");

  const [newChatTitle, setNewChatTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [showNewChat, setShowNewChat] =
    useState(false);

  const createChatMutation =
    useCreateChat(workspaceId ?? "");

  const sendMessageMutation =
    useSendMessage(
      workspaceId ?? "",
      selectedChatId,
    );

  const {
    data: messagesData,
    isLoading: messagesLoading,
    isError: messagesError,
  } = useMessages(
    workspaceId ?? "",
    selectedChatId,
  );

  const messages =
    messagesData?.messages ?? [];

  /*
   * Select the first chat automatically
   * when chats are loaded.
   */
  useEffect(() => {
    if (
      !selectedChatId &&
      chats.length > 0
    ) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, selectedChatId]);

  /*
   * If the currently selected chat
   * disappears, select another chat.
   */
  useEffect(() => {
    if (
      selectedChatId &&
      chats.length > 0 &&
      !chats.some(
        (chat) =>
          chat.id === selectedChatId,
      )
    ) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, selectedChatId]);

  async function handleCreateChat(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const title =
      newChatTitle.trim();

    if (!workspaceId || !title) {
      return;
    }

    try {
      const response =
        await createChatMutation.mutateAsync({
          title,
        });

      setNewChatTitle("");
      setShowNewChat(false);

      setSelectedChatId(
        response.chat.id,
      );
    } catch (error) {
      console.error(
        "Create chat error:",
        error,
      );
    }
  }

  async function handleSendMessage() {
    const content =
      message.trim();

    if (
      !workspaceId ||
      !selectedChatId ||
      !content
    ) {
      return;
    }

    try {
      setMessage("");

      await sendMessageMutation.mutateAsync({
        content,
      });
    } catch (error) {
      console.error(
        "Send message error:",
        error,
      );

      setMessage(content);
    }
  }

  function handleComposerKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      void handleSendMessage();
    }
  }

  if (!workspaceId) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Workspace not found
        </h1>

        <p className="mt-2 text-muted-foreground">
          No workspace was selected.
        </p>
      </div>
    );
  }

  if (workspacesLoading) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">
          Loading workspace...
        </p>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Workspace not found
        </h1>

        <p className="mt-2 text-muted-foreground">
          This workspace may have been deleted
          or you may not have access to it.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0">
      {/* ==========================================
          CHAT LIST
      ========================================== */}

      <aside className="flex w-72 shrink-0 flex-col border-r">
        {/* HEADER */}

        <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <div>
            <p className="text-xs text-muted-foreground">
              {workspace.name}
            </p>

            <h1 className="font-semibold">
              Chats
            </h1>
          </div>

          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() =>
              setShowNewChat(
                !showNewChat,
              )
            }
            title="New chat"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        {/* NEW CHAT */}

        {showNewChat && (
          <form
            onSubmit={handleCreateChat}
            className="border-b p-3"
          >
            <Input
              value={newChatTitle}
              onChange={(event) =>
                setNewChatTitle(
                  event.target.value,
                )
              }
              placeholder="Chat title..."
              autoFocus
              disabled={
                createChatMutation.isPending
              }
            />

            <Button
              type="submit"
              className="mt-2 w-full"
              disabled={
                createChatMutation.isPending ||
                !newChatTitle.trim()
              }
            >
              {createChatMutation.isPending
                ? "Creating..."
                : "Create Chat"}
            </Button>

            {createChatMutation.isError && (
              <p className="mt-2 text-xs text-red-500">
                Failed to create chat.
              </p>
            )}
          </form>
        )}

        {/* CHAT LIST */}

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {chatsLoading && (
            <div className="space-y-2 p-2">
              <div className="h-10 animate-pulse rounded-lg bg-muted" />
              <div className="h-10 animate-pulse rounded-lg bg-muted" />
              <div className="h-10 animate-pulse rounded-lg bg-muted" />
            </div>
          )}

          {chatsError && (
            <div className="p-3 text-sm text-red-500">
              Failed to load chats.
            </div>
          )}

          {!chatsLoading &&
            !chatsError &&
            chats.length === 0 && (
              <div className="p-4 text-center">
                <MessageSquare className="mx-auto size-8 text-muted-foreground" />

                <p className="mt-3 text-sm font-medium">
                  No chats yet
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Create a chat to start learning.
                </p>

                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() =>
                    setShowNewChat(true)
                  }
                >
                  <Plus className="mr-2 size-4" />
                  New Chat
                </Button>
              </div>
            )}

          {!chatsLoading &&
            chats.map((chat) => {
              const isSelected =
                chat.id ===
                selectedChatId;

              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() =>
                    setSelectedChatId(
                      chat.id,
                    )
                  }
                  className={[
                    "mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")}
                >
                  <MessageSquare className="size-4 shrink-0" />

                  <span className="min-w-0 flex-1 truncate text-sm">
                    {chat.title}
                  </span>
                </button>
              );
            })}
        </div>
      </aside>

      {/* ==========================================
          CHAT AREA
      ========================================== */}

      <section className="flex min-w-0 flex-1 flex-col">
        {!selectedChatId ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="max-w-md text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="size-7" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                Start a conversation
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Create a chat and start asking
                questions about what you're
                learning.
              </p>

              <Button
                className="mt-5"
                onClick={() =>
                  setShowNewChat(true)
                }
              >
                <Plus className="mr-2 size-4" />
                Create Chat
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* CHAT HEADER */}

            <div className="flex h-16 shrink-0 items-center border-b px-6">
              <div className="min-w-0">
                <h2 className="truncate font-semibold">
                  {
                    chats.find(
                      (chat) =>
                        chat.id ===
                        selectedChatId,
                    )?.title
                  }
                </h2>

                <p className="text-xs text-muted-foreground">
                  {workspace.name}
                </p>
              </div>
            </div>

            {/* MESSAGES */}

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
                {messagesLoading && (
                  <div className="text-center text-sm text-muted-foreground">
                    Loading messages...
                  </div>
                )}

                {messagesError && (
                  <div className="text-center text-sm text-red-500">
                    Failed to load messages.
                  </div>
                )}

                {!messagesLoading &&
                  !messagesError &&
                  messages.length === 0 && (
                    <div className="py-20 text-center">
                      <MessageSquare className="mx-auto size-10 text-muted-foreground" />

                      <h3 className="mt-4 font-semibold">
                        No messages yet
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Send your first message
                        below.
                      </p>
                    </div>
                  )}

                {messages.map(
                  (item) => {
                    const isUser =
                      item.role ===
                      "user";

                    return (
                      <div
                        key={item.id}
                        className={[
                          "flex gap-3",
                          isUser
                            ? "justify-end"
                            : "justify-start",
                        ].join(" ")}
                      >
                        {!isUser && (
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Sparkles className="size-4" />
                          </div>
                        )}

                        <div
  className={[
    "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
    isUser
      ? "bg-primary text-primary-foreground"
      : "bg-muted",
  ].join(" ")}
>
  {isUser ? (
    <div className="whitespace-pre-wrap">
      {item.content}
    </div>
  ) : (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {item.content}
      </ReactMarkdown>
    </div>
  )}
</div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* COMPOSER */}

            <div className="shrink-0 border-t p-4">
              <div className="mx-auto max-w-4xl">
                <div className="flex items-end gap-3 rounded-2xl border bg-card p-2 shadow-sm">
                  <textarea
                    value={message}
                    onChange={(event) =>
                      setMessage(
                        event.target.value,
                      )
                    }
                    onKeyDown={
                      handleComposerKeyDown
                    }
                    placeholder="Ask anything..."
                    disabled={
                      sendMessageMutation.isPending
                    }
                    rows={1}
                    className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
                  />

                  <Button
                    size="icon"
                    onClick={() =>
                      void handleSendMessage()
                    }
                    disabled={
                      sendMessageMutation.isPending ||
                      !message.trim()
                    }
                  >
                    <Send className="size-4" />
                  </Button>
                </div>

                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                  Enter to send · Shift + Enter
                  for a new line
                </p>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default ChatPage;