import api from "@/lib/api.js";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotesResponse {
  notes: Note[];
}

export interface NoteResponse {
  message?: string;
  note: Note;
}

export interface CreateNoteInput {
  title: string;
  content: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
}


// ==========================================
// GET ALL NOTES
// ==========================================

export async function getNotes(
  workspaceId: string,
): Promise<NotesResponse> {
  const response =
    await api.get<NotesResponse>(
      `/workspaces/${workspaceId}/notes`,
    );

  return response.data;
}


// ==========================================
// GET SINGLE NOTE
// ==========================================

export async function getNote(
  workspaceId: string,
  noteId: string,
): Promise<NoteResponse> {
  const response =
    await api.get<NoteResponse>(
      `/workspaces/${workspaceId}/notes/${noteId}`,
    );

  return response.data;
}


// ==========================================
// CREATE NOTE
// ==========================================

export async function createNote(
  workspaceId: string,
  data: CreateNoteInput,
): Promise<NoteResponse> {
  const response =
    await api.post<NoteResponse>(
      `/workspaces/${workspaceId}/notes`,
      data,
    );

  return response.data;
}


// ==========================================
// UPDATE NOTE
// ==========================================

export async function updateNote(
  workspaceId: string,
  noteId: string,
  data: UpdateNoteInput,
): Promise<NoteResponse> {
  const response =
    await api.patch<NoteResponse>(
      `/workspaces/${workspaceId}/notes/${noteId}`,
      data,
    );

  return response.data;
}


// ==========================================
// DELETE NOTE
// ==========================================

export async function deleteNote(
  workspaceId: string,
  noteId: string,
): Promise<void> {
  await api.delete(
    `/workspaces/${workspaceId}/notes/${noteId}`,
  );
}