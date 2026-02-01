"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "src/app/components/Header";

export default function ListsPage() {
  const router = useRouter();

  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchLists = async () => {
      const res = await fetch("/api/lists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      const data = await res.json();
      setLists(data);
      setLoading(false);
    };

    fetchLists();
  }, [router]);

  return (
    <div className="min-h-screen bg-shop-bg flex flex-col">
      {/* Global header */}
      <Header />

      {/* Main */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-shop-blue">
              Mis listas
            </h1>

            <button
              onClick={() => router.push("/lists/new")}
              className="bg-shop-green text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-shop-green-light transition"
            >
              + Nueva lista
            </button>
          </header>

          {/* Content */}
          {loading ? (
          <div className="flex items-center justify-center py-16">
            <div
              className="
                h-10 w-10
                rounded-full
                border-4
                border-gray-200
                border-t-shop-green
                animate-spin
              "
              aria-label="Cargando"
            />
          </div>
        ) : lists.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <p className="text-shop-gray mb-4">
                Todavía no tienes ninguna lista creada.
              </p>
              <button
                onClick={() => router.push("/lists/new")}
                className="bg-shop-green text-white px-5 py-3 rounded-md font-medium hover:bg-shop-green-light transition"
              >
                Crear mi primera lista
              </button>
            </div>
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lists.map((list) => (
                <li
                  key={list.id}
                  onClick={() => router.push(`/lists/${list.id}`)}
                  className="
                    bg-white rounded-xl shadow p-5 cursor-pointer
                    hover:shadow-md hover:-translate-y-0.5 transition
                  "
                >
                  <h2 className="font-medium text-shop-blue mb-1">
                    {list.name}
                  </h2>
                  <p className="text-sm text-shop-gray">
                    Toca para ver los productos
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
