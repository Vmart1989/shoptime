"use client";

import { useRouter } from "next/navigation";
import Header from "src/app/components/Header";
import {
  SparklesIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-shop-bg flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow p-8 max-w-lg w-full text-center space-y-6">
          <SparklesIcon className="h-12 w-12 mx-auto text-shop-green" />

          <h1 className="text-2xl font-bold text-shop-blue">
            ¡Bienvenido a ShopTime!
          </h1>

          <p className="text-shop-gray">
            Ya puedes crear listas de la compra de forma rápida y ordenada.
            Si quieres llevarlo al siguiente nivel, descubre lo que incluye
            <span className="font-medium text-shop-blue"> ShopTime Premium</span>.
          </p>

          {/* Beneficios */}
          <ul className="text-left space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-shop-green" />
              Crear supermercados personalizados
            </li>
            <li className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-shop-green" />
              Ordenar categorías según tu recorrido
            </li>
            <li className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-shop-green" />
              Experiencia optimizada para compras reales
            </li>
          </ul>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => router.push("/login")}
              className="
                flex-1 border border-blue-300
                py-2 rounded-md
                text-shop-blue
                hover:bg-shop-blue-dark transition
                hover:text-white              "
            >
              Empezar gratis
            </button>

            <button
              onClick={() => router.push("/premium")}
              className="
                flex-1 bg-shop-green text-white
                py-2 rounded-md font-medium
                hover:bg-shop-green-light transition
              "
            >
              Hazte Premium
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
