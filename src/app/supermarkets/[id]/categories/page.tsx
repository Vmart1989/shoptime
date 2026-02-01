"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "src/app/components/Header";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";



// DnD Kit (drag & drop)
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// =========================
// Item arrastrable (categoría)
// =========================
function SortableItem({
  id,
  name,
  order,
}: {
  id: number;
  name: string;
  order: number;
}) {
  // Hook que hace que el elemento sea arrastrable
  const {
  attributes,
  listeners,
  setNodeRef,
  transform,
  transition,
  isDragging,
} = useSortable({ id });


  // Estilos dinámicos durante el drag
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
    ref={setNodeRef}
    style={style}
    {...attributes}
    {...listeners}
    className={`
        rounded-lg shadow
        px-4 py-2
        flex items-center gap-3
        cursor-grab active:cursor-grabbing
        border transition
        ${
        isDragging
            ? "bg-shop-bg border-shop-blue ring-2 ring-shop-blue"
            : "bg-white border-gray-200 hover:shadow-md"
        }
    `}
    >
    {/* Número de orden */}
    <span className="w-6 text-sm font-semibold text-shop-blue text-center">
        {order}
    </span>

    {/* Nombre */}
    <span>{name}</span>
    </li>
  );
}

// =========================
// Página principal
// =========================
export default function SupermarketCategoriesPage() {
  const params = useParams();
  const router = useRouter();
  const supermarketId = params.id as string;

  // Estado con las categorías ordenables
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supermarketName, setSupermarketName] = useState<string>("");


  // =========================
  // Cargar categorías del supermercado
  // =========================
  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Endpoint que devuelve categorías + orden actual
    const res = await fetch(
      `/api/supermarkets/${supermarketId}/categories`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      setCategories([]);
      setLoading(false);
      return;
    }

    const data = await res.json();

    // Ordenamos por aisleOrder por seguridad
    data.sort(
      (a: any, b: any) => a.aisleOrder - b.aisleOrder
    );

    setCategories(data);
    setLoading(false);
  };

      // =========================
// Cargar nombre del supermercado
// =========================
const fetchSupermarketName = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await fetch("/api/supermarkets", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return;

  const data = await res.json();

  const supermarket = data.find(
    (s: any) => s.id === Number(supermarketId)
  );

  if (supermarket) {
    setSupermarketName(supermarket.name);
  }
};

  // =========================
  // Drag & Drop handler
  // =========================
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    // Si no hay destino o no cambia de posición, no hacemos nada
    if (!over || active.id === over.id) return;

    setCategories((items) => {
      const oldIndex = items.findIndex(
        (i) => i.id === active.id
      );
      const newIndex = items.findIndex(
        (i) => i.id === over.id
      );

      // Reordenamos el array en memoria
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  // =========================
  // Guardar el orden en backend
  // =========================
  const saveOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Transformamos el estado al formato del backend
    const body = categories.map((cat, index) => ({
      categoryId: cat.id,
      aisleOrder: index + 1,
    }));

    await fetch(
      `/api/supermarkets/${supermarketId}/categories`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    alert("Orden guardado correctamente");
  };

  // =========================
  // useEffect inicial
  // =========================
  useEffect(() => {
  fetchCategories();
  fetchSupermarketName();
}, [supermarketId]);


  // =========================
  // Render
  // =========================
  if (loading) {
    return (
          <div className="min-h-screen bg-shop-bg flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-shop-green border-t-transparent" />
            </div>
          </div>
        );
  }

  return (
  <div className="min-h-screen bg-shop-bg flex flex-col">
    {/* Header */}
    <Header />

    {/* Main content */}
    <main className="flex-1">
      <div className="p-6 max-w-md mx-auto">
        <button
        onClick={() => router.push("/supermarkets")}
        className="
            flex items-center gap-2
            text-sm text-shop-gray
            hover:text-shop-blue
            transition mb-4
        "
        >
        <ArrowLeftIcon className="h-4 w-4" />
        Volver a supermercados
        </button>

        <h1 className="text-2xl font-bold text-shop-blue">
          {supermarketName || "Ordenar categorías"}
        </h1>

        {/* Botón guardar */}
        <button
          onClick={saveOrder}
          className="mt-6 mb-2 bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Guardar orden
        </button>

        <p className="mb-4 text-gray-500">
          Pulsa y arrastra para cambiar el orden
        </p>

        {/* Drag & Drop container */}
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categories.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-2">
              {categories.map((cat, index) => (
                <SortableItem
                  key={cat.id}
                  id={cat.id}
                  name={cat.name}
                  order={index + 1}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>

        {/* Botón guardar */}
        <button
          onClick={saveOrder}
          className="mt-6 bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Guardar orden
        </button>
      </div>
    </main>
  </div>
);

}
