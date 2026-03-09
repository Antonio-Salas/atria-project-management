export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      {/* Subtle radial glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="w-150 h-150 rounded-full bg-zinc-800/30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 mb-4 shadow-lg">
            <svg
              className="w-7 h-7 text-zinc-100"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
            Atria
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Gestor de proyectos</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl shadow-black/40 p-8">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-zinc-100">
              Bienvenido de vuelta
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Inicia sesión para continuar
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:border-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            {/* Google SVG logo */}
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path
                d="M47.532 24.552c0-1.636-.132-3.196-.388-4.692H24.48v9.021h12.984c-.572 2.98-2.24 5.5-4.748 7.188v5.94h7.664c4.488-4.132 7.152-10.22 7.152-17.457Z"
                fill="#4285F4"
              />
              <path
                d="M24.48 48c6.48 0 11.928-2.152 15.9-5.82l-7.664-5.94c-2.14 1.432-4.872 2.288-8.236 2.288-6.336 0-11.704-4.276-13.624-10.02H3.008v6.136C6.96 42.988 15.168 48 24.48 48Z"
                fill="#34A853"
              />
              <path
                d="M10.856 28.508A14.363 14.363 0 0 1 10.1 24c0-1.568.268-3.092.756-4.508v-6.136H3.008A23.987 23.987 0 0 0 .48 24c0 3.872.928 7.532 2.528 10.644l7.848-6.136Z"
                fill="#FBBC05"
              />
              <path
                d="M24.48 9.472c3.568 0 6.772 1.228 9.296 3.64l6.932-6.932C36.4 2.152 30.96 0 24.48 0 15.168 0 6.96 5.012 3.008 13.356l7.848 6.136c1.92-5.744 7.288-10.02 13.624-10.02Z"
                fill="#EA4335"
              />
            </svg>
            Continuar con Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-zinc-900 px-3 text-zinc-600">
                Al iniciar sesión aceptas los
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-600">
            <a href="#" className="underline underline-offset-2 hover:text-zinc-400 transition-colors">
              Términos de servicio
            </a>{" "}
            y la{" "}
            <a href="#" className="underline underline-offset-2 hover:text-zinc-400 transition-colors">
              Política de privacidad
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-700 mt-6">
          © {new Date().getFullYear()} Atria. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
