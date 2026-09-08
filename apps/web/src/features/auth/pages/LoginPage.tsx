import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "@/services/auth.service.js";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login({
        email,
        password,
      });

      localStorage.setItem(
        "studxo_token",
        response.token,
      );

      localStorage.setItem(
        "studxo_user",
        JSON.stringify(response.user),
      );

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);

      const message =
        error.response?.data?.message ||
        "Login failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-2xl border bg-card p-8 shadow-sm"
      >
        {/* ==========================================
            BRAND
        ========================================== */}
        <div className="flex flex-col items-center text-center">
          <img
            src="/studxo-mark.png"
            alt="Stud.xo"
            className="size-16 object-contain"
          />

          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Welcome to Stud.xo
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Your AI learning workspace
          </p>
        </div>

        {/* ==========================================
            EMAIL
        ========================================== */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="you@example.com"
            required
            disabled={loading}
            className="w-full rounded-md border bg-background px-3 py-2 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* ==========================================
            PASSWORD
        ========================================== */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="••••••••"
            required
            disabled={loading}
            className="w-full rounded-md border bg-background px-3 py-2 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* ==========================================
            ERROR
        ========================================== */}
        {error && (
          <div className="rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2">
            <p className="text-sm text-red-500">
              {error}
            </p>
          </div>
        )}

        {/* ==========================================
            LOGIN BUTTON
        ========================================== */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;