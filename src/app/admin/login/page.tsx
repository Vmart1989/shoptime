"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
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

    // 🔑 comprobar si es admin
    const meRes = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });

    if (!meRes.ok) {
      setError("Acceso no autorizado");
      return;
    }

    const me = await meRes.json();

    if (me.role !== "ADMIN") {
      localStorage.removeItem("token");
      setError("No tienes permisos de administrador");
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-shop-bg flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <img src="/icono-circulo.png" alt="" className="w-50 m-auto " />
        <h1 className="text-xl font-bold text-shop-blue mb-6 text-center">
          Acceso administrador
        </h1>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-3 p-2 border rounded"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-shop-green text-white py-2 rounded hover:bg-shop-green-light transition"
        >
          Entrar como admin
        </button>
      </div>
    </div>
  );
}
