"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Zap, Mail, Lock, ArrowRight } from "lucide-react";

export 
default function LoginPage() {
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
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
    if (error) setError(traducirError(error.message));
  }

  return (
    <AuthShell>
      <h1 className="font-display text-3xl mb-2">Bienvenido de nuevo</h1>
      <p className="text-ink-300 text-sm mb-8">Entra para calcular, presupuestar y cobrar con criterio.</p>

      <button
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-2 border border-line rounded-xl py-3 mb-4 text-sm font-medium hover:bg-white/5 transition-colors"
      >
        <GoogleIcon />
        Continuar con Google
      </button>

      <div className="flex items-center gap-3 my-5">
        <div className="h-px bg-line flex-1" />
        <span className="text-xs text-ink-500 uppercase tracking-widest">o</span>
        <div className="h-px bg-line flex-1" />
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <Field icon={<Mail size={16} />} type="email" placeholder="tucorreo@ejemplo.com" value={email} onChange={setEmail} />
        <Field icon={<Lock size={16} />} type="password" placeholder="Contraseña" value={password} onChange={setPassword} />

        {error && <p className="text-sm text-mag">{error}</p>}

        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-mag text-white rounded-xl py-3 font-semibold shadow-glow-sm hover:shadow-glow transition-shadow disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"} <ArrowRight size={16} />
        </button>
      </form>

      <p className="text-sm text-ink-500 mt-8 text-center">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-violet-400 hover:text-violet-200">
          Regístrate
        </Link>
      </p>
    </AuthShell>
  );
}

function traducirError(msg: string) {
  if (msg.includes("Invalid login credentials")) return "Email o contraseña incorrectos.";
  if (msg.includes("Email not confirmed")) return "Confirma tu email antes de entrar (revisa tu bandeja).";
  return msg;
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-mag flex items-center justify-center shadow-glow-sm">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display text-xl tracking-wide">VALORA</span>
        </div>
        <div className="bg-panel/80 backdrop-blur border border-line rounded-2xl p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  type,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500">{icon}</span>
      <input
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-void/60 border border-line rounded-xl py-3 pl-10 pr-4 text-sm placeholder:text-ink-500 focus:outline-none focus:border-violet-500 focus:shadow-glow-sm transition-shadow"
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
