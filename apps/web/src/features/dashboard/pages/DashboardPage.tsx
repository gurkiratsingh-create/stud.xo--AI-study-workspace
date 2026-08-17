function DashboardPage() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <p className="text-sm text-muted-foreground">
          Your learning workspace
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Welcome back 👋
        </h1>

        <p className="mt-2 text-muted-foreground">
          What do you want to learn today?
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold">
            AI Chat
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Ask questions and learn with your AI assistant.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold">
            Documents
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Upload and learn from your study material.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold">
            Research
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Search, understand and organize knowledge.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;