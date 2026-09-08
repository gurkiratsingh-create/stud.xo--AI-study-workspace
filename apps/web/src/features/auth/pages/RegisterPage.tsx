import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "@/services/auth.service.js";

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters.",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        name,
        email,
        password,
      });

      /*
       * If the backend returns a token after registration,
       * store it and take the user directly to Dashboard.
       */
      if (response.token) {
        localStorage.setItem(
          "studxo_token",
          response.token,
        );

        if (response.user) {
          localStorage.setItem(
            "studxo_user",
            JSON.stringify(response.user),
          );
        }

        navigate("/dashboard");
      } else {
        /*
         * If registration does not automatically log
         * the user in, send them to Login.
         */
        navigate("/login");
      }
    } catch (error: any) {
      console.error(
        "Registration error:",
        error,
      );

      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

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
            Create your Stud.xo account
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Start building your AI learning workspace
          </p>
        </div>

        {/* ==========================================
            NAME
        ========================================== */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium"
          >
            Name
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Your name"
            required
            disabled={loading}
            className="w-full rounded-md border bg-background px-3 py-2 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
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
            CONFIRM PASSWORD
        ========================================== */}
        <div className="space-y-2">
          <label
            htmlFor="confirm-password"
            className="text-sm font-medium"
          >
            Confirm password
          </label>

          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value,
              )
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
            REGISTER BUTTON
        ========================================== */}
        <button
          type="submit"
          disabled={
            loading ||
            !name.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword
          }
          className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Creating account..."
            : "Create account"}
        </button>

        {/* ==========================================
            LOGIN LINK
        ========================================== */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;