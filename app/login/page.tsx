"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, Field, GoogleIcon } from "@/components/auth";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(traducirError(error.message));
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogle() {
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(traducirError(error.message));
    }
  }

  return (
    <AuthShell>
      <h1 className="font-display text-3xl mb-2">
        Bienvenido de nuevo
      </h1>

      <p className="text-ink-300 text-sm mb-8">
        Entra para calcular, presupuestar y cobrar con criterio.
      </p>

      <button
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-2 border border-line rounded-xl py-3 mb-4 text-sm font-medium hover:bg-white/5 transition-colors"
      >
        <GoogleIcon />
        Continuar con Google
      </button>

      <div className="flex items-center gap-3 my-5">
        <div className="h-px bg-line flex-1" />
        <span className="text-xs text-ink-500 uppercase tracking-widest">
          o
        </span>
        <div className="h-px bg-line flex-1" />
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <Field
          icon={<Mail size={16} />}
          type="email"
          placeholder="tucorreo@ejemplo.com"
          value={email}
          onChange={setEmail}
        />

        <Field
          icon={<Lock size={16} />}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={setPassword}
        />

        {error && (
          <p className="text-sm text-mag">{error}</p>
        )}

        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-mag text-white rounded-xl py-3 font-semibold shadow-glow-sm hover:shadow-glow transition-shadow disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
          <ArrowRight size={16} />
        </button>
      </form>

      <p className="text-sm text-ink-500 mt-8 text-center">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="text-violet-400 hover:text-violet-200"
        >
          Regístrate
        </Link>
      </p>
    </AuthShell>
  );
}

function traducirError(msg: string) {
  if (msg.includes("Invalid login credentials")) {
    return "Email o contraseña incorrectos.";
  }

  if (msg.includes("Email not confirmed")) {
    return "Confirma tu email antes de entrar (revisa tu bandeja).";
  }

  return msg;
}