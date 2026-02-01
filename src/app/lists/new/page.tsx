"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "src/app/components/Header";

export default function NewListPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createList = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/lists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      setError("No se pudo crear la lista");
      setLoading(false);
      return;
    }

    const list = await res.json();

    // 👉 Ir directamente a la lista creada
    router.push(`/lists/${list.id}`);
  };

  return (
    <div className="min-h-screen bg-shop-bg flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="max-w-md mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold text-shop-blue mb-6">
            Nueva lista
          </h1>

          <div className="bg-white rounded-xl shadow p-6">
            <label className="block text-sm font-medium text-shop-gray mb-2">
              Nombre de la lista
            </label>

            <input
              className="w-full border rounded p-2 mb-4"
              placeholder="Ej. Compra semanal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {error && (
              <p className="text-red-600 text-sm mb-3">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/lists")}
                className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm hover:bg-gray-50 transition"
              >
                Cancelar
              </button>

              <button
                onClick={createList}
                disabled={!name.trim() || loading}
                className="
                  flex-1 bg-shop-green text-white rounded
                  px-4 py-2 text-sm font-medium
                  disabled:opacity-50
                  hover:bg-shop-green-light transition
                "
              >
                {loading ? "Creando..." : "Crear lista"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
