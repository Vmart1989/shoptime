"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "src/app/components/Header";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError("Credenciales incorrectas");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    router.push("/lists");
  };

  return (
    <div className="min-h-screen bg-shop-bg flex flex-col">
      {/* Global header */}
      <Header />

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4">
        <section className="bg-white rounded-xl shadow p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-shop-blue mb-2 text-center">
            Bienvenido a ShopTime
          </h1>

          <p className="text-sm text-shop-gray mb-6 text-center">
            Accede a tus listas y optimiza tus compras
          </p>

          <input
            className="w-full mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-shop-green"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-shop-green"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-shop-green text-white py-3 rounded-md font-medium hover:bg-shop-green-light transition"
          >
            Entrar
          </button>

          <p className="text-sm text-shop-gray mt-6 text-center">
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-shop-blue font-medium hover:underline"
            >
              Regístrate gratis
            </button>
          </p>
        </section>
      </main>
    </div>
  );
}
