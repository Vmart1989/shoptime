"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";

export default function PremiumPage() {
  const router = useRouter();

  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const [coupon, setCoupon] = useState("");
  const [processing, setProcessing] = useState(false);
  const PRICE = 9.99;

  // =========================
  // CHECK USER STATUS
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

      const data = await res.json();
      setIsPremium(data.isPremium);
      setLoading(false);
    };

    fetchMe();
  }, []);

  // =========================
  // SIMULATED PAYMENT
  // =========================
  const [error, setError] = useState<string | null>(null);

const handlePayment = async () => {
  setProcessing(true);
  setError(null);

  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await fetch("/api/premium/activate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      coupon: coupon.trim() || null,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "No se pudo activar Premium");
    setProcessing(false);
    return;
  }

  // SOLO si el backend confirma
  setIsPremium(true);
  setProcessing(false);
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
        <section className="max-w-xl mx-auto px-4 py-12 space-y-8">
          <header className="text-center">
            <h1 className="text-3xl font-bold text-shop-blue">
              ShopTime Premium
            </h1>
            <p className="text-shop-gray mt-2">
              Organiza tus compras como un profesional
            </p>
          </header>

          {/* Benefits */}
          <div className="bg-white rounded-xl shadow p-6 space-y-3">
            <h2 className="font-semibold text-shop-blue">
              ¿Qué incluye Premium?
            </h2>
            <ul className="text-sm text-shop-gray list-disc pl-5 space-y-1">
              <li>Supermercados personalizados</li>
              <li>Orden de categorías por supermercado</li>
              <li>Mejor organización de listas</li>
              <li>Funciones avanzadas futuras</li>
            </ul>
          </div>

          {/* Status */}
          {isPremium ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <p className="text-green-700 font-medium">
                Ya eres usuario Premium 🎉
              </p>
              <button
                onClick={() => router.push("/supermarkets")}
                className="mt-4 bg-shop-green text-white px-5 py-2 rounded-md"
              >
                Ir a supermercados
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              <div className="text-center">
                <span className="text-4xl font-bold text-shop-blue">
                  9,99 €
                </span>
                <span className="text-shop-gray"> / año</span>
              </div>

              {/* Coupon */}
              <input
                className="w-full border rounded-md p-2"
                placeholder="Cupón"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              {error && (
            <p className="text-sm text-red-600 text-center">
            {error}
            </p>
            )}

                        {/* Mockup métodos de pago */}
            <div className="space-y-3">
            <p className="text-sm font-medium text-shop-blue">
                Método de pago
            </p>

            {/* Tarjeta */}
            {/* Apple Pay */}
<div
  className="
    flex items-center justify-between
    border rounded-md p-3
    opacity-50 cursor-not-allowed
  "
>
  <div className="flex items-center gap-3">
    <img
      src="/pay/credit-card-logos.png"
      alt="Apple Pay"
      className="h-6 object-contain"
    />
    <span className="text-sm text-shop-gray">
      Pago con tarjeta
    </span>
  </div>

</div>


            {/* Apple Pay */}
            <div
  className="
    flex items-center justify-between
    border rounded-md p-3
    opacity-50 cursor-not-allowed
  "
>
  <div className="flex items-center gap-3">
    <img
      src="/pay/apple-pay.png"
      alt="Apple Pay"
      className="h-6 object-contain"
    />
    
  </div>

  <span className="text-xs text-gray-400">
    Próximamente
  </span>
</div>
            </div>



              <button
                onClick={handlePayment}
                disabled={processing || coupon.trim() === ""}
                className="
                    w-full bg-shop-green text-white
                    py-3 rounded-md font-medium
                    hover:bg-shop-green-light transition
                    disabled:opacity-50 disabled:cursor-not-allowed
                "
                >
                {processing ? "Procesando pago..." : "Hacerse Premium"}
                </button>


              <p className="text-xs text-shop-gray text-center">
                Pago simulado
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
