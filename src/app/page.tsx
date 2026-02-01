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
          <section className="bg-white rounded-xl shadow  p-6 md:pb-0 md:pt-0 md:pr-0 md:pl-6 grid gap-6 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-shop-blue mb-4">
                Optimiza tus compras<br />en el supermercado
              </h1>

              <p className="text-shop-gray mb-6 text-lg">
                Crea listas organizadas según el recorrido real de tu tienda habitual.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    router.push(isLogged ? "/lists" : "/register")
                  }
                  className="bg-shop-green text-white px-5 py-3 rounded-md font-medium hover:bg-shop-green-light transition cursor-pointer"
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
            <div className="md:flex justify-content-end rounded-r-lg ">
              <img
                src="/man-in-supermarket.jpg"
                alt="ShopTime App"
                className="max-h-100 rounded-xl md:rounded-s"
              />
            </div>
          </section>

          {/* FEATURES */}
<section className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
  <IconFeature Icon={ShoppingCartIcon} text="Recorrido eficiente" subtitle="Los productos de tu lista se ordenan automáticamente según los pasillos del establecimiento que elijas" />

  <IconFeature Icon={ClockIcon} text="Ahorra tiempo" subtitle="Ahorra tiempo y dinero con un recorrido optimizado. Sin distracciones ni olvidos" />
  
  <IconFeature Icon={DevicePhoneMobileIcon} text="100% sin descargas" subtitle="Guarda Shoptime en tus favoritos y accede desde la web, sin descargar aplicaciones" />

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
  subtitle,
}: {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  text: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-12 w-12 rounded-full bg-shop-green-light flex items-center justify-center">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <span className="text-m text-shop-blue">
        {text}
      </span>
      <span className="text-sm text-gray-500 font-small">
        {subtitle}
      </span>
    </div>
  );
}
