"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";

// Dashboard admin con estadísticas
export default function AdminDashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // CARGAR ESTADÍSTICAS
  // =========================
  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const res = await fetch("/api/admin/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 403) {
      router.push("/");
      return;
    }

    setStats(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-shop-bg flex flex-col">
        <Header />

        <div className="flex-1 flex items-center justify-center">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-shop-bg flex flex-col">
      {/* Header */}
      <Header />

      {/* Main */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-10 space-y-10">
          {/* Page title */}
          <header>
            <h1 className="text-2xl font-bold text-shop-blue">
              Panel de administración
            </h1>
            <p className="text-sm text-shop-gray mt-1">
              Métricas generales del sistema
            </p>
          </header>

          {/* KPIs */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              onClick={() => router.push("/admin/users")}
              className="
              bg-white rounded-xl shadow p-6 cursor-pointer
              hover:shadow-md hover:-translate-y-0.5 transition
            "
            >
              <h2 className="font-semibold text-shop-blue mb-2">Usuarios</h2>
              <p className="text-sm text-shop-gray">
                Total: {stats.users.total}
              </p>
              <p className="text-sm text-shop-gray">
                Premium: {stats.users.premium}
              </p>
              <p className="text-sm text-shop-gray">Free: {stats.users.free}</p>
              <p className="text-sm text-shop-gray">
                Administrador: {stats.users.admin}
              </p>
            </div>

            <div
              onClick={() => router.push("/admin/products")}
              className="
              bg-white rounded-xl shadow p-6 cursor-pointer
              hover:shadow-md hover:-translate-y-0.5 transition
            "
            >
              <h2 className="font-semibold text-shop-blue mb-2">Productos</h2>
              <p className="text-sm text-shop-gray">
                Total: {stats.products.total}
              </p>
              <p className="text-sm text-shop-gray">
                Globales: {stats.products.global}
              </p>
              <p className="text-sm text-shop-gray">
                Privados: {stats.products.private}
              </p>
            </div>
          </section>

          {/* Rankings */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold text-shop-blue mb-4">
                Productos más añadidos
              </h2>
              <ul className="space-y-1 text-sm text-shop-gray">
                {stats.topProducts.map((p: any) => (
                  <li key={p.name}>
                    {p.name}{" "}
                    <span className="text-shop-blue font-medium">
                      ({p.count})
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold text-shop-blue mb-4">
                Categorías más usadas
              </h2>
              <ul className="space-y-1 text-sm text-shop-gray">
                {stats.topCategories.map((c: any) => (
                  <li key={c.name}>
                    {c.name}{" "}
                    <span className="text-shop-blue font-medium">
                      ({c.count})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
                {/* Supermercados */}
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold text-shop-blue mb-4">
              Supermercados creados
            </h2>

            {stats.supermarkets.length === 0 ? (
              <p className="text-sm text-shop-gray">
                No hay supermercados creados todavía.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-shop-gray border-b border-b-blue-200 ">
                      <th className="py-2">Nombre</th>
                      <th className="py-2">Usuario</th>
                      <th className="py-2">Fecha de creación</th>
                    </tr>
                  </thead>

                  <tbody>
                    {stats.supermarkets.map((s: any) => (
                      <tr
                        key={s.id}
                        className="border-b border-b-blue-200 last:border-b-0"
                      >
                        <td className="py-2 font-medium text-shop-blue">
                          {s.name}
                        </td>
                        <td className="py-2 text-shop-gray">
                          {s.user.email}
                        </td>
                        <td className="py-2 text-shop-gray">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>





        </section>
      </main>
    </div>
  );
}
