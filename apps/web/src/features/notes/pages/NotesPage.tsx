import { useState } from "react";

import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useWorkspaces } from "@/features/dashboard/hooks/useWorkspaces";
import { useNotes } from "@/features/notes/hooks/useNotes";

import {
  createNote,
  deleteNote,
} from "@/services/notes.service.js";

function NotesPage() {
  const { workspaceId } =
    useParams<{ workspaceId: string }>();

  const {
    data: workspaceData,
    isLoading: workspacesLoading,
  } = useWorkspaces();

  const workspace = workspaceData?.workspaces.find(
    (item) => item.id === workspaceId,
  );

  const {
    data: notesData,
    isLoading: notesLoading,
    isError: notesError,
    refetch,
  } = useNotes(workspaceId ?? "");

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [creating, setCreating] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  async function handleCreateNote(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!workspaceId) {
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      return;
    }

    try {
      setCreating(true);

      await createNote(workspaceId, {
        title: trimmedTitle,
        content: trimmedContent,
      });

      setTitle("");
      setContent("");
      setShowCreateForm(false);

      await refetch();
    } catch (error) {
      console.error(
        "Create note error:",
        error,
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteNote(
    noteId: string,
  ) {
    if (!workspaceId) {
      return;
    }

    try {
      setDeletingId(noteId);

      await deleteNote(
        workspaceId,
        noteId,
      );

      await refetch();
    } catch (error) {
      console.error(
        "Delete note error:",
        error,
      );
    } finally {
      setDeletingId(null);
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
          This workspace may have been deleted or
          you may not have access to it.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {workspace.name}
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Notes
          </h1>

          <p className="mt-2 text-muted-foreground">
            Create and organize your study notes.
          </p>
        </div>

        <Button
          onClick={() =>
            setShowCreateForm(!showCreateForm)
          }
        >
          {showCreateForm
            ? "Cancel"
            : "+ New Note"}
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <form
          onSubmit={handleCreateNote}
          className="space-y-4 rounded-xl border bg-card p-6"
        >
          <div>
            <label
              htmlFor="note-title"
              className="text-sm font-medium"
            >
              Title
            </label>

            <Input
              id="note-title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="e.g. Neural Networks"
              disabled={creating}
              className="mt-2"
            />
          </div>

          <div>
            <label
              htmlFor="note-content"
              className="text-sm font-medium"
            >
              Content
            </label>

            <textarea
              id="note-content"
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              placeholder="Write your notes..."
              disabled={creating}
              className="mt-2 min-h-40 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>

          <Button
            type="submit"
            disabled={
              creating ||
              !title.trim() ||
              !content.trim()
            }
          >
            {creating
              ? "Creating..."
              : "Create Note"}
          </Button>
        </form>
      )}

      {/* Loading */}
      {notesLoading && (
        <p className="text-muted-foreground">
          Loading notes...
        </p>
      )}

      {/* Error */}
      {notesError && (
        <p className="text-red-500">
          Failed to load notes.
        </p>
      )}

      {/* Empty */}
      {notesData &&
        notesData.notes.length === 0 && (
          <div className="rounded-xl border border-dashed p-8">
            <h2 className="font-semibold">
              No notes yet
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Create your first study note in{" "}
              {workspace.name}.
            </p>
          </div>
        )}

      {/* Notes */}
      {notesData &&
        notesData.notes.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {notesData.notes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl border bg-card p-6"
              >
                <h2 className="text-lg font-semibold">
                  {note.title}
                </h2>

                <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                  {note.content}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    By {note.createdByName}
                  </p>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      handleDeleteNote(note.id)
                    }
                    disabled={
                      deletingId === note.id
                    }
                  >
                    {deletingId === note.id
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default NotesPage;