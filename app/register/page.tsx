"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, Field, GoogleIcon } from "@/components/auth";
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  async function handleGoogle() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  }

  if (done) {
    return (
      <AuthShell>
        <div className="text-center py-6">
          <CheckCircle2 className="mx-auto mb-4 text-violet-400" size={40} />
          <h1 className="font-display text-2xl mb-2">Revisa tu correo</h1>
          <p className="text-ink-300 text-sm">
            Te hemos enviado un enlace de confirmación a <b className="text-ink-100">{email}</b>. Ábrelo para activar tu cuenta.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="font-display text-3xl mb-2">Crea tu cuenta</h1>
      <p className="text-ink-300 text-sm mb-8">Empieza a presupuestar con criterio en menos de un minuto.</p>

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

      <form onSubmit={handleRegister} className="space-y-4">
        <Field icon={<User size={16} />} type="text" placeholder="Nombre completo" value={name} onChange={setName} />
        <Field icon={<Mail size={16} />} type="email" placeholder="tucorreo@ejemplo.com" value={email} onChange={setEmail} />
        <Field icon={<Lock size={16} />} type="password" placeholder="Contraseña (mín. 6 caracteres)" value={password} onChange={setPassword} />

        {error && <p className="text-sm text-mag">{error}</p>}

        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-mag text-white rounded-xl py-3 font-semibold shadow-glow-sm hover:shadow-glow transition-shadow disabled:opacity-60"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"} <ArrowRight size={16} />
        </button>
      </form>

      <p className="text-sm text-ink-500 mt-8 text-center">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-violet-400 hover:text-violet-200">
          Inicia sesión
        </Link>
      </p>
    </AuthShell>
  );
}
