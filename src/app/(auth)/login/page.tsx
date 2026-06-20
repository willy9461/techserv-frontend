"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { login, getMe } from "@/api/users";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, setIsLoading, isLoading } = useAuthStore();

  const [user, setUserInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const { access_token, refresh_token } = await login(user, password);
      const me = await getMe(access_token);
      setAuth(me, access_token, refresh_token);

      const roleRedirects: Record<string, string> = {
        cliente: "/tickets",
        tecnico: "/agenda",
        supervisor: "/dashboard",
        administrador: "/dashboard",
        area_administrativa: "/facturacion",
      };

      router.push(roleRedirects[me.role] ?? "/tickets");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { status?: number } }).response?.status ===
          "number" &&
        (err as { response: { status: number } }).response.status === 401
      ) {
        setError("Usuario o contraseña incorrectos");
      } else {
        setError("Error al iniciar sesión. Intentá de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          TechServ
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={user}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu contraseña"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Ingresando..." : "Iniciar sesión"}
          </button>
          <p className="text-center text-sm text-gray-500">
            ¿No tenés cuenta?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Registrate
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
