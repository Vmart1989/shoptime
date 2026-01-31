"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    return <p className="p-6">Cargando estadísticas...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Dashboard de administración
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border p-4 rounded">
          <h2 className="font-semibold">Usuarios</h2>
          <p>Total: {stats.users.total}</p>
          <p>Premium: {stats.users.premium}</p>
          <p>Free: {stats.users.free}</p>
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-semibold">Productos</h2>
          <p>Total: {stats.products.total}</p>
          <p>Globales: {stats.products.global}</p>
          <p>Privados: {stats.products.private}</p>
        </div>
      </div>

      {/* Rankings */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">
            Productos más añadidos
          </h2>
          <ul>
            {stats.topProducts.map((p: any) => (
              <li key={p.name}>
                {p.name} ({p.count})
              </li>
            ))}
          </ul>
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">
            Categorías más usadas
          </h2>
          <ul>
            {stats.topCategories.map((c: any) => (
              <li key={c.name}>
                {c.name} ({c.count})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
