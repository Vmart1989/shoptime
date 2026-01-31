"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "src/app/components/Header";
import {
  ShoppingCartIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";


export default function HomePage() {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);

  // Leer el estado de login solo en cliente (evita hydration mismatch)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-shop-bg flex flex-col">
      {/* Header */}
      <Header />

      {/* Main */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-12 space-y-12 ">

          {/* HERO */}
          <section className="bg-white rounded-xl shadow  p-6 md:pb-0 md:pt-0 md:p-6 grid gap-6 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-shop-blue mb-4">
                Optimiza tus compras<br />en el supermercado
              </h1>

              <p className="text-shop-gray mb-6">
                Crea listas organizadas según el recorrido real de tu tienda habitual.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    router.push(isLogged ? "/lists" : "/register")
                  }
                  className="bg-shop-green text-white px-5 py-3 rounded-md font-medium hover:bg-shop-green-light transition"
                >
                  {isLogged ? "Ir a mis listas" : "Regístrate Gratis"}
                </button>

                {!isLogged && (
                  <button
                    onClick={() => router.push("/login")}
                    className="border border-gray-300 px-5 py-3 rounded-md text-shop-blue hover:bg-gray-50 transition"
                  >
                    Acceder
                  </button>
                )}
              </div>
            </div>

            {/* Imagen mockup (opcional) */}
            <div className="hidden md:flex justify-center">
              <img
                src="/man-in-supermarket.png"
                alt="ShopTime App"
                className="max-h-100"
              />
            </div>
          </section>

          {/* FEATURES */}
<section className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
  <IconFeature Icon={ShoppingCartIcon} text="Recorrido eficiente" />
  <IconFeature Icon={ClockIcon} text="Ahorra tiempo" />
  <IconFeature Icon={DevicePhoneMobileIcon} text="100% sin descargas" />
</section>



        </section>
      </main>
    </div>
  );
}

/* Componente interno para iconos */
import type { ComponentType, SVGProps } from "react";

function IconFeature({
  Icon,
  text,
}: {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-12 w-12 rounded-full bg-shop-green-light flex items-center justify-center">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <span className="text-sm text-shop-blue font-medium">
        {text}
      </span>
    </div>
  );
}
