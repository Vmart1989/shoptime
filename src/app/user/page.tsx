"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";

export default function UserPage() {
  const router = useRouter();

  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // CARGAR USUARIO
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchMe = async () => {
      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        router.push("/login");
        return;
      }

      setUser(await res.json());
      setLoading(false);
    };

    fetchMe();
  }, []);

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
        <section className="max-w-xl mx-auto px-4 py-12 space-y-8">
          {/* Header */}
          <header>
            <h1 className="text-2xl font-bold text-shop-blue">
              Mi cuenta
            </h1>
            <p className="text-sm text-shop-gray mt-1">
              Información de tu perfil
            </p>
          </header>

          {/* Datos usuario */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="font-medium">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Miembro desde</p>
              <p className="font-medium">
                {new Date(user.registrationDate).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Tipo de cuenta</p>
              <span
                className={`
                  inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium
                  ${
                    user.isPremium
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }
                `}
              >
                {user.isPremium ? "Premium" : "Free"}
              </span>
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-2 gap-4">
            <div onClick={() => router.push("/lists")} className="bg-white rounded-xl shadow p-4 text-center cursor-pointer">
              <p className="text-sm text-shop-gray">Mis listas</p>
              <p className="text-2xl font-bold text-shop-blue">
                {user.listsCount ?? 0}
              </p>
            </div>

            <div onClick={() => router.push("/supermarkets")} className="bg-white rounded-xl shadow p-4 text-center cursor-pointer">
              <p className="text-sm text-shop-gray">
                Mis supermercados
              </p>
              <p className="text-2xl font-bold text-shop-blue">
                {user.supermarketsCount ?? 0}
              </p>
            </div>
          </div>

          {/* CTA Premium */}
          {!user.isPremium && (
            <div className="bg-shop-blue text-white rounded-xl p-6 text-center space-y-3">
              <p className="font-semibold">
                Desbloquea todas las funciones Premium
              </p>
              <p className="text-sm opacity-90">
                Supermercados personalizados y mejor organización
              </p>
              <button
                onClick={() => router.push("/premium")}
                className="
                  bg-white text-shop-blue
                  px-5 py-2 rounded-md font-medium
                  hover:bg-gray-100 transition
                  cursor-pointer
                "
              >
                Hacerse Premium
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
