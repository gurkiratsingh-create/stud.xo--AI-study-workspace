import api from "@/lib/api.js";

export interface Chat {
  id: string;
  workspaceId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ChatsResponse {
  chats: Chat[];
}

export interface ChatResponse {
  message?: string;
  chat: Chat;
}

export interface MessagesResponse {
  messages: Message[];
}

export interface CreateChatInput {
  title: string;
}

export interface SendMessageInput {
  content: string;
}

export interface SendMessageResponse {
  message: string;
  data: {
    userMessage: Message;
    assistantMessage: Message;
  };
}

export async function getChats(
  workspaceId: string,
): Promise<ChatsResponse> {
  const response =
    await api.get<ChatsResponse>(
      `/workspaces/${workspaceId}/chats`,
    );

  return response.data;
}

export async function getChat(
  workspaceId: string,
  chatId: string,
): Promise<ChatResponse> {
  const response =
    await api.get<ChatResponse>(
      `/workspaces/${workspaceId}/chats/${chatId}`,
    );

  return response.data;
}

export async function createChat(
  workspaceId: string,
  data: CreateChatInput,
): Promise<ChatResponse> {
  const response =
    await api.post<ChatResponse>(
      `/workspaces/${workspaceId}/chats`,
      data,
    );

  return response.data;
}

export async function getMessages(
  workspaceId: string,
  chatId: string,
): Promise<MessagesResponse> {
  const response =
    await api.get<MessagesResponse>(
      `/workspaces/${workspaceId}/chats/${chatId}/messages`,
    );

  return response.data;
}

export async function sendMessage(
  workspaceId: string,
  chatId: string,
  data: SendMessageInput,
): Promise<SendMessageResponse> {
  const response =
    await api.post<SendMessageResponse>(
      `/workspaces/${workspaceId}/chats/${chatId}/messages`,
      data,
    );

  return response.data;
}