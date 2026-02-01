"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // No logeado → login admin
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    // Comprobar rol
    fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error();
        }
        return res.json();
      })
      .then((user) => {
        if (user.role === "ADMIN") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/admin/login");
        }
      })
      .catch(() => {
        router.replace("/admin/login");
      });
  }, [router]);

  // Pantalla neutra mientras decide
  return (
    <div className="min-h-screen bg-shop-bg flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-shop-green border-t-transparent" />
    </div>
  );
}
