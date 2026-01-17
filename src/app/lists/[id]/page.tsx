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

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);

  // =========================
  // CARGAR ITEMS DE LA LISTA
  // =========================
  const fetchItems = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const res = await fetch(`/api/lists/${listId}/items`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    setGroups(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [listId]);

  // =========================
  // AUTOCOMPLETE DE PRODUCTOS
  // =========================
  const searchProducts = async (value: string) => {
    setSearch(value);
    setSelectedProduct(null);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    const res = await fetch(`/api/products?search=${value}`);
    setResults(await res.json());
  };

  // =========================
  // AÑADIR PRODUCTO A LA LISTA
  // =========================
  const addProduct = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let body: any;

    if (selectedProduct) {
      body = {
        productId: selectedProduct.id,
        quantity,
      };
    } else {
      body = {
        productName: search,
        categoryId: 7, // Despensa por defecto
        quantity,
      };
    }

    await fetch(`/api/lists/${listId}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    // Resetear estado
    setSearch("");
    setResults([]);
    setSelectedProduct(null);
    setQuantity(1);

    setLoading(true);
    await fetchItems();
  };

  // =========================
  // TOGGLE COMPRADO
  // =========================
  const toggleChecked = async (itemId: number, isChecked: boolean) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`/api/lists/${listId}/items/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isChecked }),
    });

    setLoading(true);
    await fetchItems();
  };

  // =========================
  // ELIMINAR ITEM
  // =========================
  const removeItem = async (itemId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`/api/lists/${listId}/items/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setLoading(true);
    await fetchItems();
  };

  // Actualizar la cantidad de un producto
const updateQuantity = async (itemId: number, newQuantity: number) => {
  if (newQuantity < 1) return;

  const token = localStorage.getItem("token");
  if (!token) return;

  await fetch(
    `/api/lists/${listId}/items/${itemId}/quantity`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity: newQuantity }),
    }
  );

  setLoading(true);
  await fetchItems();
};


  // =========================
  // RENDER
  // =========================
  if (loading) {
    return <p className="p-6">Cargando lista...</p>;
  }

  return (
    <div className="p-6">
      {/* Añadir producto */}
      <div className="mb-6">
        <input
          className="border p-2 w-full mb-2"
          placeholder="Añadir producto..."
          value={search}
          onChange={(e) => searchProducts(e.target.value)}
        />

        {results.length > 0 && (
          <ul className="border border-t-0 bg-white">
            {results.map((product) => (
              <li
                key={product.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedProduct(product);
                  setSearch(product.name);
                  setResults([]);
                }}
              >
                {product.name}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-2 mt-2">
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 border p-2"
          />

          <button
            onClick={addProduct}
            disabled={!search || quantity < 1}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Añadir
          </button>
        </div>
      </div>

      {/* Lista de productos */}
      {groups.length === 0 && (
        <p className="text-gray-500">
          Esta lista todavía no tiene productos.
        </p>
      )}

      {groups.map((group) => (
        <div key={group.category.id} className="mb-6">
          <h2 className="font-bold mb-2">{group.category.name}</h2>

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
                      item.isChecked
                        ? "line-through text-gray-400"
                        : ""
                    }
                  >
                    <div className="flex items-center gap-2">
  <span>{item.product.name}</span>

  <button
    onClick={() =>
      updateQuantity(item.id, item.quantity - 1)
    }
    className="px-2 border rounded"
  >
    −
  </button>

  <span className="w-6 text-center">
    {item.quantity}
  </span>

  <button
    onClick={() =>
      updateQuantity(item.id, item.quantity + 1)
    }
    className="px-2 border rounded"
  >
    +
  </button>
</div>

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
