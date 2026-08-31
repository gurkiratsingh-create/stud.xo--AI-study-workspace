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
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-xl border p-8"
      >
        <div>
          <h1 className="text-3xl font-bold">
            Login
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Login to your Stud.xo workspace
          </p>
        </div>

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
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

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
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;