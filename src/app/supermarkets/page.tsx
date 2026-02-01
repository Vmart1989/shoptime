"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "src/app/components/Header";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function SupermarketsPage() {
  const router = useRouter();

  const [supermarkets, setSupermarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // =========================
  // Cargar usuario + supermercados
  // =========================
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const meRes = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!meRes.ok) {
      router.push("/login");
      return;
    }

    const me = await meRes.json();
    setIsPremium(me.isPremium);

    if (!me.isPremium) {
      setLoading(false);
      return;
    }

    const res = await fetch("/api/supermarkets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      setError("Error cargando supermercados");
      setLoading(false);
      return;
    }

    setSupermarkets(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // Crear supermercado
  // =========================
  const createSupermarket = async () => {
    if (!name.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/supermarkets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description: description || null,
      }),
    });

    if (!res.ok) {
      setError("No se pudo crear el supermercado");
      return;
    }

    const supermarket = await res.json();

    setName("");
    setDescription("");

    router.push(`/supermarkets/${supermarket.id}/categories`);
  };

  // =========================
  // Borrar supermercado
  // =========================
  const deleteSupermarket = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar este supermercado?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`/api/supermarkets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchData();
  };

  // =========================
  // Render loading
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-shop-bg flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-shop-green border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-shop-bg flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-shop-blue mb-6">
          Mis supermercados
        </h1>


{/* Usuario gratuito */}
          {!isPremium && (
  <div className="bg-white rounded-xl shadow p-6 text-center">
    <h2 className="text-xl font-semibold text-shop-blue mb-3">
      Función Premium
    </h2>

    <p className="text-shop-gray mb-4">
      Los supermercados personalizados te permiten organizar
      tus listas según el recorrido real de tu tienda habitual.
    </p>

    <p className="text-shop-gray mb-6">
      Contrata el plan <span className="font-medium">Premium</span> para
      crear supermercados, ordenar categorías y optimizar tus compras.
    </p>

    <button
      onClick={() => router.push("/premium")}
      className="
        bg-shop-green text-white
        px-6 py-3 rounded-md
        font-medium
        hover:bg-shop-green-light
        transition
      "
    >
      Pasar a Premium
    </button>
  </div>
)}  

        {/* Premium */}
        {isPremium && (
          <>
            {/* Crear supermercado */}
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <h2 className="font-semibold text-shop-blue mb-4">
                Crear supermercado
              </h2>

              <input
                className="w-full border p-2 rounded mb-3"
                placeholder="Nombre del supermercado"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                className="w-full border p-2 rounded mb-4"
                placeholder="Descripción (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button
                onClick={createSupermarket}
                disabled={!name.trim()}
                className="bg-shop-green text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Crear supermercado
              </button>
            </div>

            {/* Listado */}
            {supermarkets.length === 0 ? (
              <p className="text-shop-gray">
                Todavía no has creado ningún supermercado.
              </p>
            ) : (
              <div className="grid gap-4">
                {supermarkets.map((s) => (
                  <div
                    key={s.id}
                    onClick={() =>
                      router.push(
                        `/supermarkets/${s.id}/categories`
                      )
                    }
                    className="
                      relative bg-white rounded-xl shadow p-4
                      cursor-pointer hover:shadow-md
                      transition
                    "
                  >
                    {/* Botón borrar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSupermarket(s.id);
                      }}
                      className="
                        absolute top-2 right-2
                        text-gray-400 hover:text-red-600
                        transition
                      "
                      title="Eliminar supermercado"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>

                    <h3 className="font-semibold text-shop-blue">
                      {s.name}
                    </h3>

                    {s.description && (
                      <p className="text-sm text-shop-gray mt-1">
                        {s.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )
        }

        {error && (
          <p className="text-red-600 mt-4">{error}</p>
        )}
      </main>
    </div>
  );
}
