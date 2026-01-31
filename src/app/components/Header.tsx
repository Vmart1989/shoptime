"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);

  // Leer token solo en cliente
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  return (
    <header className="sticky top-0 mt-12 z-50 bg-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img
            src="/icono-circulo.png"
            alt="ShopTime"
            className="h-40 w-42"
            onClick={() => router.push("/")}
          />
         
        </div>

        {/* Navegación */}
        <div className="flex items-center gap-4">
         


          {isLogged ? (
            <button
              onClick={() => router.push("/lists")}
              className="bg-shop-green text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-shop-green-light transition"
            >
              Mis listas
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="bg-shop-green text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-shop-green-light transition"
            >
              Acceder
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
