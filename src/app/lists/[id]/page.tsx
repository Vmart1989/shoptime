"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// Página que muestra el contenido de una lista concreta
export default function ListDetailPage() {
  const router = useRouter();
  const params = useParams();
  const listId = params.id as string;

  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar los productos de la lista
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si no hay token, redirigir al login
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchItems = async () => {
      const res = await fetch(`/api/lists/${listId}/items`, {
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
      setGroups(data);
      setLoading(false);
    };

    fetchItems();
  }, [listId, router]);

  // Marcar o desmarcar un producto como comprado
  const toggleChecked = async (itemId: number, isChecked: boolean) => {
    const token = localStorage.getItem("token");

    await fetch(`/api/lists/${listId}/items/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isChecked }),
    });

    // Recargar la lista tras el cambio
    setLoading(true);
    const res = await fetch(`/api/lists/${listId}/items`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGroups(await res.json());
    setLoading(false);
  };

  // Eliminar un producto de la lista
  const removeItem = async (itemId: number) => {
    const token = localStorage.getItem("token");

    await fetch(`/api/lists/${listId}/items/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Recargar la lista tras eliminar
    setLoading(true);
    const res = await fetch(`/api/lists/${listId}/items`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGroups(await res.json());
    setLoading(false);
  };

  if (loading) {
    return <p className="p-6">Cargando lista...</p>;
  }

  return (
    <div className="p-6">
      <button
        onClick={() => router.push("/lists")}
        className="mb-4 text-sm text-blue-600"
      >
        ← Volver a listas
      </button>

      {groups.length === 0 && (
        <p className="text-gray-500">
          Esta lista todavía no tiene productos.
        </p>
      )}

      {groups.map((group) => (
        <div key={group.category.id} className="mb-6">
          <h2 className="font-bold mb-2">
            {group.category.name}
          </h2>

          <ul className="space-y-2">
            {group.items.map((item: any) => (
              <li
                key={item.id}
                className="flex items-center justify-between border p-2 rounded"
              >
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.isChecked}
                    onChange={(e) =>
                      toggleChecked(item.id, e.target.checked)
                    }
                  />
                  <span
                    className={
                      item.isChecked ? "line-through text-gray-400" : ""
                    }
                  >
                    {item.product.name}
                  </span>
                </label>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 text-sm"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
