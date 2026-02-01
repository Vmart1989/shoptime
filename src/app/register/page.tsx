"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "src/app/components/Header";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!email.includes("@")) {
      setError("Email no válido");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.status === 409) {
        setError("Ya existe una cuenta con este email");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError("Error creando la cuenta");
        setLoading(false);
        return;
      }

      // Registro correcto → login
      router.push("/welcome");
    } catch (err) {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-shop-bg flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6 w-full max-w-md space-y-4"
        >
          <h1 className="text-2xl font-bold text-shop-blue">
            Crear cuenta
          </h1>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <input
            type="text"
            placeholder="Nombre"
            className="w-full border border-gray-300 rounded-md p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-md p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full border border-gray-300 rounded-md p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full bg-shop-green text-white
              py-2 rounded-md font-medium
              hover:bg-shop-green-light
              disabled:opacity-50
              transition
            "
          >
            {loading ? "Creando cuenta..." : "Registrarme"}
          </button>

          <p className="text-sm text-center text-shop-gray">
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-shop-blue hover:underline"
            >
              Inicia sesión
            </button>
          </p>
        </form>
      </main>
    </div>
  );
}
