# Valora — MVP funcional

App de Next.js 15 + Supabase (auth con email/contraseña y Google + base de datos
Postgres). Negro + morado, futurista, tipografía Inter + Space Grotesk.

## Qué contiene esta carpeta

```
app/
  login/           formulario de inicio de sesión
  register/        formulario de registro
  auth/callback/    ruta que Supabase usa tras el login con Google
  dashboard/        todo lo que hay detrás del login
    clientes/        CRUD de clientes
    calculadora/     calculadora de precio + genera presupuesto
    historial/       historial de ventas/presupuestos con estado
    ajustes/         perfil del usuario
components/         Sidebar (barra lateral del dashboard)
lib/supabase/       conexión a Supabase (cliente, servidor, middleware)
supabase/schema.sql  el "molde" de la base de datos, lo pegas en Supabase
middleware.ts        protege /dashboard si no has iniciado sesión
```

---

## Paso 1 — Base de datos en Supabase (5 min)

1. Entra en tu proyecto de Supabase (o crea uno nuevo en supabase.com).
2. Ve a **SQL Editor** → **New query**.
3. Abre el archivo `supabase/schema.sql` de esta carpeta, copia todo su
   contenido, pégalo ahí y dale a **Run**. Esto crea las tablas `clients`,
   `sales` y `settings`, y las protege para que cada usuario solo vea sus
   propios datos (Row Level Security).
4. Ve a **Authentication → Providers** y activa **Google**:
   - Necesitas un Client ID y Secret de Google Cloud Console
     (APIs & Services → Credentials → OAuth Client ID → tipo "Web application").
   - En "Authorized redirect URIs" de Google pon la URL que te muestra
     Supabase en esa misma pantalla (algo como
     `https://TU-PROYECTO.supabase.co/auth/v1/callback`).
   - Pega el Client ID y Secret en Supabase y guarda.
5. Ve a **Project Settings → API** y copia:
   - `Project URL` → será tu `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → será tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Paso 2 — Probarlo en local (opcional pero recomendado)

```bash
npm install
cp .env.local.example .env.local
# rellena .env.local con las dos claves del paso anterior
npm run dev
```

Abre `http://localhost:3000` — debería redirigirte a `/login`.

## Paso 3 — Subir el código a GitHub

```bash
git init
git add .
git commit -m "Valora MVP"
```

Crea un repositorio nuevo en GitHub y sigue las instrucciones que te da para
subir el código (`git remote add origin ...` y `git push`).

## Paso 4 — Desplegar en Vercel (5 min)

1. En Vercel: **Add New → Project** → importa el repositorio de GitHub.
2. En **Environment Variables** añade las mismas que en `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` → pon la URL que Vercel te asigne (o tu dominio
     final, puedes cambiarla luego)
3. Dale a **Deploy**. En ~1 minuto tendrás una URL tipo
   `valora-app.vercel.app` ya funcionando de verdad, con base de datos real.
4. Vuelve a Supabase → **Authentication → URL Configuration** y añade esa URL
   (y luego tu dominio final) en **Site URL** y **Redirect URLs**, si no el
   login con Google no redirigirá bien.

## Paso 5 — Comprar el dominio y conectarlo

1. Compra el dominio donde prefieras (Namecheap, Google Domains/Squarespace,
   IONOS, etc. — no hace falta que sea el mismo sitio que el hosting).
2. En Vercel: **tu proyecto → Settings → Domains → Add** y escribe tu dominio
   (ej. `valora.app`).
3. Vercel te da 1-2 registros DNS para añadir (normalmente un `A` o `CNAME`).
   Los pegas en el panel de DNS de donde compraste el dominio.
4. Espera la propagación (de minutos a un par de horas). Vercel emite el
   certificado HTTPS automáticamente.
5. Actualiza `NEXT_PUBLIC_SITE_URL` en Vercel y las Redirect URLs en Supabase
   con el dominio definitivo.

---

## Notas sobre lo que es "MVP" aquí y qué falta para producción real

- **Falta:** generación de PDF descargable del presupuesto (ahora mismo se
  guarda como registro en el historial, pero no exporta el archivo), envío
  de emails automáticos, y facturación/Stripe. Todo esto es la "Fase 2"
  lógica según lo que ya tenías planeado.
- El cálculo de precio usa las tarifas base y extras que definí a partir del
  feedback de las entrevistas; son puntos de partida editables en
  `CalculatorClient.tsx` (constantes `SERVICE_TYPES`, `EXTRAS`, etc.), no un
  valor fijo — ajústalos a lo que veas en tus propios pilotos.
- El login por email requiere confirmar el correo (Supabase lo envía solo).
  Si quieres desactivar esa confirmación para pruebas rápidas, está en
  **Authentication → Providers → Email → "Confirm email"**.
# Valora-Claude
