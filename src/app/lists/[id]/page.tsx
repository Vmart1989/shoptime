"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "src/app/components/Header";
import { TrashIcon } from "@heroicons/react/24/outline";



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

  const [supermarkets, setSupermarkets] = useState<any[]>([]);
  const [selectedSupermarket, setSelectedSupermarket] = useState<number | null>(null);

  
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);



 // =========================
// CARGAR SUPERMERCADOS
// =========================
const fetchSupermarkets = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await fetch("/api/supermarkets", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Si no está autorizado, salimos sin romper
  if (res.status === 401) {
    setSupermarkets([]);
    return;
  }

  // Leemos el body como texto
  const text = await res.text();

  // Si el body está vacío, no intentamos JSON.parse
  if (!text) {
    setSupermarkets([]);
    return;
  }

  // Parseamos manualmente
  setSupermarkets(JSON.parse(text));
};

// =========================
// CARGAR CATEGORÍAS GLOBALES
// =========================
const fetchCategories = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await fetch("/api/categories", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    setCategories([]);
    return;
  }

  setCategories(await res.json());
};



  // =========================
  // CARGAR ITEMS DE LA LISTA
  // =========================
  const fetchItems = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  // 1️⃣ Obtener datos de la lista (para saber el supermercado)
  const listRes = await fetch(`/api/lists/${listId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (listRes.status === 401) {
    localStorage.removeItem("token");
    router.push("/login");
    return;
  }

  const listData = await listRes.json();
  setSelectedSupermarket(listData.supermarketId);

  // 2️⃣ Obtener los items de la lista
  const itemsRes = await fetch(`/api/lists/${listId}/items`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (itemsRes.status === 401) {
    localStorage.removeItem("token");
    router.push("/login");
    return;
  }

  setGroups(await itemsRes.json());
  setLoading(false);
};

  

  useEffect(() => {
  fetchItems();
  fetchSupermarkets();
  fetchCategories();
}, [listId]);

// Cambiar supermercado de la lista
const changeSupermarket = async (supermarketId: number | null) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  await fetch(`/api/lists/${listId}/supermarket`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ supermarketId }),
  });

  setSelectedSupermarket(supermarketId);
  setLoading(true);
  await fetchItems();
};


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

  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await fetch(`/api/products?search=${value}`, {
    headers: {
      Authorization: `Bearer ${token}`, // 🔑 CLAVE
    },
  });

  if (!res.ok) {
    setResults([]);
    return;
  }

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
        categoryId: selectedCategory,
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
 
  return (
    <div className="min-h-screen bg-shop-bg flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-10 space-y-8">
          {loading ? (
            <p className="text-shop-gray">Cargando lista...</p>
          ) : (
            <>
              {/* Supermarket selector */}
              <div className="bg-white rounded-xl shadow p-6">
                <label className="block text-sm font-medium text-shop-blue mb-2">
                  Supermercado
                </label>

                <select
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                  value={selectedSupermarket ?? ""}
                  onChange={(e) =>
                    changeSupermarket(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                >
                  <option value="">
                    Sin supermercado (orden general)
                  </option>

                  {supermarkets.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              

              {/* Add product */}
              
                <input
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                  placeholder="Añadir producto..."
                  value={search}
                  onChange={(e) => searchProducts(e.target.value)}
                />

                {results.length > 0 && (
                  <ul className="border rounded-md bg-white">
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

                {!selectedProduct && search.trim() !== "" && (
                  <select
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={selectedCategory ?? ""}
                    onChange={(e) =>
                      setSelectedCategory(Number(e.target.value))
                    }
                  >
                    <option value="">
                      Selecciona categoría
                    </option>

                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Number(e.target.value))
                    }
                    className="w-24 border border-gray-300 rounded-md p-2"
                  />

                  <button
                    onClick={addProduct}
                    disabled={
                      !search ||
                      quantity < 1 ||
                      (!selectedProduct && !selectedCategory)
                    }
                    className="bg-shop-green text-white px-5 py-2 rounded-md font-medium disabled:opacity-50"
                  >
                    Añadir
                  </button>
                </div>
             </div>
             

              {/* Items */}
              {groups.length === 0 ? (
  <p className="text-shop-gray">
    Esta lista todavía no tiene productos.
  </p>
) : (
  <div className="bg-white rounded-xl shadow p-6 space-y-6">
    {groups.map((group) => (
      <div key={group.category.id}>
        {/* Category title */}
        <h2 className="font-bold text-shop-blue mb-3">
          {group.category.name}
        </h2>

        <ul className="space-y-3">
          {group.items.map((item: any) => (
            <li
              key={item.id}
              className="flex items-center justify-between"
            >
              <label className="flex items-center gap-3">
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
                  {item.product.name}
                </span>
              </label>

              <div className="flex items-center gap-2">
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

                {/* Trash icon */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-2 text-red-500 hover:text-red-700 transition"
                  title="Eliminar producto"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)}

            </>
          )}
        </section>
      </main>
    </div>
  );
}
