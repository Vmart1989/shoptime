"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Página de administración de usuarios
export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =========================
  // CARGAR USUARIOS (ADMIN)
  // =========================
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
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

  // =========================
  // RENDER
  // =========================
  if (loading) {
    return <p className="p-6">Cargando usuarios...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Administración de usuarios
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2">Rol</th>
              <th className="border p-2">Premium</th>
              <th className="border p-2">Listas</th>
              <th className="border p-2">Productos</th>
              <th className="border p-2">Supermercados</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="border p-2">{u.email}</td>

                {/* Selector de rol */}
                <td className="border p-2 text-center">
                  <select
                    value={u.role}
                    onChange={(e) =>
                      updateUser(u.id, {
                        role: e.target.value as "USER" | "ADMIN",
                      })
                    }
                    className="border p-1"
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
    </div>
  );
}
