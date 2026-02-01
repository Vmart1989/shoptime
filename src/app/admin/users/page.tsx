"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";

// Página de administración de usuarios
export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<
    "ALL" | "ADMIN" | "USER"
    >("ALL");

    const [typeFilter, setTypeFilter] = useState<
    "ALL" | "PREMIUM" | "FREE"
    >("ALL");


  // =========================
  // CARGAR USUARIOS (ADMIN)
  // =========================
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const res = await fetch("/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Si no es admin → fuera
    if (res.status === 403) {
      router.push("/");
      return;
    }

    if (!res.ok) {
      setError("Error cargando usuarios");
      setLoading(false);
      return;
    }

    setUsers(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // ACTUALIZAR USUARIO
  // =========================
  const updateUser = async (
    userId: number,
    data: { isPremium?: boolean; role?: "USER" | "ADMIN" }
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    // Recargar lista tras actualizar
    fetchUsers();
  };

  const filteredUsers = users.filter((u) => {
  if (roleFilter !== "ALL" && u.role !== roleFilter) {
    return false;
  }

  if (typeFilter === "PREMIUM" && !u.isPremium) {
    return false;
  }

  if (typeFilter === "FREE" && u.isPremium) {
    return false;
  }

  return true;
});

const counts = {
  total: users.length,
  admin: users.filter((u) => u.role === "ADMIN").length,
  user: users.filter((u) => u.role === "USER").length,
  premium: users.filter((u) => u.isPremium).length,
  free: users.filter((u) => !u.isPremium).length,
};


  // =========================
  // RENDER
  // =========================
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


if (error) {
  return (
    <div className="min-h-screen bg-shop-bg flex flex-col">
      <Header />
      <p className="p-6 text-red-600">{error}</p>
    </div>
  );
}

return (
  <div className="min-h-screen bg-shop-bg flex flex-col">
    {/* Header */}
    <Header />

    {/* Main */}
    <main className="flex-1">
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        {/* Title + back */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-shop-blue">
              Administración de usuarios
            </h1>
            <p className="text-sm text-shop-gray mt-1">
              Gestión de roles, premium y métricas
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/dashboard")}
            className="
              text-sm text-shop-blue font-medium
              hover:underline
            "
          >
            ← Volver al panel
          </button>
        </header>

        {/* Table card */}
{/* Filters */}
<div className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row gap-4">
  {/* Role filter */}
  <div className="flex gap-2 flex-wrap">
    {[
      { key: "ALL", label: "Todos", count: counts.total },
      { key: "ADMIN", label: "Administrador", count: counts.admin },
      { key: "USER", label: "Clientes", count: counts.user },
    ].map((f) => (
      <button
        key={f.key}
        onClick={() => setRoleFilter(f.key as any)}
        className={`
          px-3 py-1.5 rounded-full text-sm font-medium border
          ${
            roleFilter === f.key
              ? "bg-shop-blue text-white border-shop-blue"
              : "bg-white text-shop-gray border-gray-300 hover:bg-gray-50"
          }
        `}
      >
        {f.label} ({f.count})
      </button>
    ))}
  </div>

  {/* Type filter */}
  <div className="flex gap-2 flex-wrap">
    {[
      { key: "ALL", label: "Todos", count: counts.total },
      { key: "PREMIUM", label: "Premium", count: counts.premium },
      { key: "FREE", label: "Free", count: counts.free },
    ].map((f) => (
      <button
        key={f.key}
        onClick={() => setTypeFilter(f.key as any)}
        className={`
          px-3 py-1.5 rounded-full text-sm font-medium border
          ${
            typeFilter === f.key
              ? "bg-shop-green text-white border-shop-green"
              : "bg-white text-shop-gray border-gray-300 hover:bg-gray-50"
          }
        `}
      >
        {f.label} ({f.count})
      </button>
    ))}
  </div>
</div>



        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-center">Rol</th>
                <th className="border p-2 text-center">Premium</th>
                <th className="border p-2 text-center">Listas</th>
                <th className="border p-2 text-center">Productos</th>
                <th className="border p-2 text-center">Supermercados</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50 transition"
                >
                <td className="border p-2">
                <div className="font-medium">{u.email}</div>
                <div className="text-sm text-gray-700">{u.name}</div>

                <p className="text-xs text-gray-500 mt-1">
                    Miembro desde{" "}
                    {new Date(u.registrationDate).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    })}
                </p>
                </td>

                  {/* Selector de rol */}
                  <td className="border p-2 text-center">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        updateUser(u.id, {
                          role: e.target.value as
                            | "USER"
                            | "ADMIN",
                        })
                      }
                      className="border rounded p-1"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>

                  {/* Toggle premium */}
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={u.isPremium}
                      onChange={(e) =>
                        updateUser(u.id, {
                          isPremium: e.target.checked,
                        })
                      }
                    />
                  </td>

                  {/* Métricas */}
                  <td className="border p-2 text-center">
                    {u.listsCount}
                  </td>
                  <td className="border p-2 text-center">
                    {u.privateProductsCount}
                  </td>
                  <td className="border p-2 text-center">
                    {u.supermarketsCount}
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
