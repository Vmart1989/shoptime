"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";






export default function Header() {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");


  // Leer token solo en cliente
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    setIsLogged(false);
    return;
  }

  setIsLogged(true);

  const fetchMe = async () => {
    const res = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      localStorage.removeItem("token");
      setIsLogged(false);
      setUser(null);
      return;
    }

    const data = await res.json();
    setUser(data);
  };

  fetchMe();
}, []);

//funcion para cerrar sesion
const logout = () => {
  localStorage.removeItem("token");
  setIsLogged(false);
  setUser(null);
  router.push("/login");
};


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
            className="h-30 w-30 sm:h-40 sm:w-40"
            onClick={() => router.push("/")}
          />
         
        </div>

        {/* Navegación */}
        <div className="flex items-center gap-4">
         


          {isLogged && user ? (
  <>
    {/* Usuario */}
    <div  onClick={() => router.push("/user")} className="flex items-center gap-2 text-sm text-shop-blue cursor-pointer">
      <UserCircleIcon className="h-8 w-8" />
      <span onClick={() => router.push("/user")} className="hidden sm:inline font-medium">
  {user.name || user.email}
</span>

    </div>
{!isAdminRoute && (
  <>
    {/* Mis listas */}
<button
  onClick={() => router.push("/lists")}
  className="
    flex items-center gap-1
    bg-shop-green text-white
    px-3 py-2 sm:px-4
    rounded-md text-sm font-medium
    hover:bg-shop-green-light transition
    cursor-pointer
  "
  title="Mis listas"
>
    {/* Icono solo en móvil */}
    <ClipboardDocumentListIcon className="h-8 w-8 sm:hidden " />

    {/* Texto solo en desktop */}
    <span className="hidden sm:inline">
      Mis listas
    </span>
  </button>


    {/* Supermercados */}
<button
  onClick={() => router.push("/supermarkets")}
  className="
    lex items-center gap-1
    bg-shop-blue-dark text-white
    px-3 py-2 sm:px-4
    rounded-md text-sm font-medium
    hover:bg-shop-blue transition
    cursor-pointer
  "
  title="Supermercados"
>
  <BuildingStorefrontIcon className="h-8 w-8 sm:hidden" />
  <span className="hidden sm:inline">
    Supermercados
  </span>
</button>
 </>
)}

    {/* Logout */}
    <button
  onClick={logout}
  className="flex items-center gap-1 text-sm text-shop-gray hover:text-shop-blue transition cursor-pointer"
  title="Cerrar sesión"
>
  <ArrowRightStartOnRectangleIcon className="h-8 w-8 sm:hidden text-shop-blue" />
  <span className="hidden sm:inline">
    Cerrar sesión
  </span>
</button>

  </>
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
