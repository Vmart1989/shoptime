"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "src/app/components/Header";
import { XMarkIcon } from "@heroicons/react/24/outline";


export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "global" | "user">("all");

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");

  // =========================
  // CARGAR PRODUCTOS
  // =========================
  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const param =
      filter === "all" ? "" : `?origin=${filter}`;

    const res = await fetch(`/api/admin/products${param}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      setLoading(false);
      return;
    }

    setProducts(await res.json());
    setLoading(false);
  };

  // =========================
  // CARGAR CATEGORÍAS
  // =========================
  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setCategories(await res.json());
    }
  };

  // =========================
  // CREAR PRODUCTO GLOBAL
  // =========================
  const createProduct = async () => {
    const token = localStorage.getItem("token");
    if (!token || !name || !categoryId) return;

    await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        categoryId,
      }),
    });

    setName("");
    setCategoryId("");
    setLoading(true);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filter]);

  // =========================
// BORRAR PRODUCTO
// =========================
const deleteProduct = async (productId: number) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const confirmed = confirm(
    "¿Seguro que quieres eliminar este producto?"
  );
  if (!confirmed) return;

  await fetch(`/api/admin/products/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setLoading(true);
  fetchProducts();
};


  // =========================
  // RENDER
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-shop-bg flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-shop-green animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-shop-bg flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-shop-blue">
              Administración de productos
            </h1>

            <button
              onClick={() => router.push("/admin/dashboard")}
              className="text-sm text-shop-blue hover:underline"
            >
              ← Volver al panel
            </button>
          </header>

          {/* Filtro */}
          <div className="flex gap-2">
            {["all", "global", "user"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1 rounded text-sm ${
                  filter === f
                    ? "bg-shop-green text-white"
                    : "bg-white border"
                }`}
              >
                {f === "all"
                  ? "Todos"
                  : f === "global"
                  ? "Globales"
                  : "Usuarios"}
              </button>
            ))}
          </div>

          {/* Crear producto */}
          <div className="bg-white rounded-xl shadow p-4 flex gap-2">
            <input
              className="border p-2 flex-1 rounded"
              placeholder="Nombre del producto"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <select
              className="border p-2 rounded"
              value={categoryId}
              onChange={(e) =>
                setCategoryId(Number(e.target.value))
              }
            >
              <option value="">Categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={createProduct}
              className="bg-shop-green text-white px-4 rounded"
            >
              Crear
            </button>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Nombre</th>
                  <th className="border p-2">Categoría</th>
                  <th className="border p-2">Origen</th>
                  <th className="border p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="border p-2">
                      {p.name}
                    </td>
                    <td className="border p-2">
                      {p.category.name}
                    </td>
                    <td className="border p-2 text-center">
                    {p.userId
                        ? p.user?.email
                        : "Global"}
                    </td>
                    <td className="border p-2 text-center">
                    <button
                        onClick={() => deleteProduct(p.id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Eliminar producto"
                    >
                        <XMarkIcon className="h-5 w-5 mx-auto" />
                    </button>
                    </td>

                  </tr>
                  
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
