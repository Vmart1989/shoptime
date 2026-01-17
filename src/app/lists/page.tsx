"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Página que muestra las listas del usuario autenticado
export default function ListsPage() {
  const router = useRouter();

  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar las listas del usuario al montar la página
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si no hay token, redirigir al login
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

      // Si el token no es válido, forzamos login
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

  if (loading) {
    return <p className="p-6">Cargando listas...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis listas</h1>

      {lists.length === 0 && (
        <p className="text-gray-500">
          Todavía no tienes ninguna lista creada.
        </p>
      )}

      <ul className="space-y-2">
        {lists.map((list) => (
          <li
            key={list.id}
            className="p-4 border rounded cursor-pointer hover:bg-gray-50"
            onClick={() => router.push(`/lists/${list.id}`)}
          >
            {list.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
