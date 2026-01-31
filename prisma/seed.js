// Script para poblar la base de datos con datos iniciales
// Se utiliza para cargar categorías y productos base
// Se ejecuta mediante: npx prisma db seed

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Crear categorías base si no existen
  await prisma.category.createMany({
    data: [
      { name: "Frutas y verduras", defaultOrder: 1 },
    { name: "Carnicería", defaultOrder: 2 },
    { name: "Pescadería", defaultOrder: 3 },
    { name: "Lácteos", defaultOrder: 4 },
    { name: "Panadería", defaultOrder: 5 },
    { name: "Bebidas", defaultOrder: 6 },
    { name: "Despensa", defaultOrder: 7 },
    { name: "Congelados", defaultOrder: 8 },
    { name: "Limpieza", defaultOrder: 9 },
    { name: "Higiene personal", defaultOrder: 10 },
    { name: "Bebé", defaultOrder: 11 },
    { name: "Mascotas", defaultOrder: 12 },
    { name: "Orgánico (bio)", defaultOrder: 13 },
    { name: "Hogar", defaultOrder: 14 },
    { name: "Farmacia", defaultOrder: 15 },
    ],
    skipDuplicates: true, // Evita duplicados si se ejecuta más de una vez
  });

  console.log("✔ Categories seeded");

  // Obtener todas las categorías para mapear nombre → id
  const categories = await prisma.category.findMany();
  const categoryMap = Object.fromEntries(
    categories.map((c) => [c.name, c.id])
  );

  // Crear productos base del catálogo global
  await prisma.product.createMany({
    data: [
  /* ===================== LÁCTEOS ===================== */
  { name: "Leche entera", categoryId: categoryMap["Lácteos"] },
  { name: "Leche semidesnatada", categoryId: categoryMap["Lácteos"] },
  { name: "Leche desnatada", categoryId: categoryMap["Lácteos"] },
  { name: "Leche sin lactosa", categoryId: categoryMap["Lácteos"] },
  { name: "Leche de almendra", categoryId: categoryMap["Lácteos"] },
  { name: "Leche de soja", categoryId: categoryMap["Lácteos"] },
  { name: "Mantequilla", categoryId: categoryMap["Lácteos"] },
  { name: "Margarina", categoryId: categoryMap["Lácteos"] },
  { name: "Nata para cocinar", categoryId: categoryMap["Lácteos"] },
  { name: "Nata para montar", categoryId: categoryMap["Lácteos"] },
  { name: "Yogur natural", categoryId: categoryMap["Lácteos"] },
  { name: "Yogur griego", categoryId: categoryMap["Lácteos"] },
  { name: "Yogur de fresa", categoryId: categoryMap["Lácteos"] },
  { name: "Flan", categoryId: categoryMap["Lácteos"] },
  { name: "Natillas", categoryId: categoryMap["Lácteos"] },
  { name: "Queso rallado", categoryId: categoryMap["Lácteos"] },
  { name: "Queso en lonchas", categoryId: categoryMap["Lácteos"] },
  { name: "Queso fresco", categoryId: categoryMap["Lácteos"] },
  { name: "Queso curado", categoryId: categoryMap["Lácteos"] },
  { name: "Huevos", categoryId: categoryMap["Lácteos"] },

  /* ===================== FRUTAS Y VERDURAS ===================== */
  { name: "Plátanos", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Manzanas", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Peras", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Naranjas", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Mandarinas", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Limones", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Fresas", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Uvas", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Kiwi", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Piña", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Melón", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Sandía", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Tomates", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Tomates cherry", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Lechuga", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Espinacas", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Zanahorias", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Pepinos", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Calabacines", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Berenjenas", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Cebollas", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Ajos", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Pimientos verdes", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Pimientos rojos", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Brócoli", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Coliflor", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Patatas", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Champiñones", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Setas", categoryId: categoryMap["Frutas y verduras"] },
  { name: "Aguacates", categoryId: categoryMap["Frutas y verduras"] },

  /* ===================== PANADERÍA ===================== */
  { name: "Barra de pan", categoryId: categoryMap["Panadería"] },
  { name: "Pan integral", categoryId: categoryMap["Panadería"] },
  { name: "Pan de molde", categoryId: categoryMap["Panadería"] },
  { name: "Pan de semillas", categoryId: categoryMap["Panadería"] },
  { name: "Pan sin gluten", categoryId: categoryMap["Panadería"] },
  { name: "Croissants", categoryId: categoryMap["Panadería"] },
  { name: "Napolitanas de chocolate", categoryId: categoryMap["Panadería"] },
  { name: "Magdalenas", categoryId: categoryMap["Panadería"] },
  { name: "Donuts", categoryId: categoryMap["Panadería"] },
  { name: "Bizcocho", categoryId: categoryMap["Panadería"] },

  /* ===================== CARNICERÍA ===================== */
  { name: "Pechuga de pollo", categoryId: categoryMap["Carnicería"] },
  { name: "Muslos de pollo", categoryId: categoryMap["Carnicería"] },
  { name: "Carne picada", categoryId: categoryMap["Carnicería"] },
  { name: "Filetes de ternera", categoryId: categoryMap["Carnicería"] },
  { name: "Chuletas de cerdo", categoryId: categoryMap["Carnicería"] },
  { name: "Costillas", categoryId: categoryMap["Carnicería"] },
  { name: "Hamburguesas", categoryId: categoryMap["Carnicería"] },
  { name: "Salchichas", categoryId: categoryMap["Carnicería"] },
  { name: "Pavo en lonchas", categoryId: categoryMap["Carnicería"] },
  { name: "Jamón cocido", categoryId: categoryMap["Carnicería"] },
  { name: "Jamón serrano", categoryId: categoryMap["Carnicería"] },
  { name: "Chorizo", categoryId: categoryMap["Carnicería"] },
  { name: "Salchichón", categoryId: categoryMap["Carnicería"] },

  /* ===================== PESCADERÍA ===================== */
  { name: "Salmón", categoryId: categoryMap["Pescadería"] },
  { name: "Merluza", categoryId: categoryMap["Pescadería"] },
  { name: "Atún fresco", categoryId: categoryMap["Pescadería"] },
  { name: "Boquerones", categoryId: categoryMap["Pescadería"] },
  { name: "Sardinas", categoryId: categoryMap["Pescadería"] },
  { name: "Calamares", categoryId: categoryMap["Pescadería"] },
  { name: "Gambas", categoryId: categoryMap["Pescadería"] },
  { name: "Mejillones", categoryId: categoryMap["Pescadería"] },
  { name: "Palitos de cangrejo", categoryId: categoryMap["Pescadería"] },
 

  /* ===================== DESPENSA ===================== */
  { name: "Arroz", categoryId: categoryMap["Despensa"] },
  { name: "Pasta", categoryId: categoryMap["Despensa"] },
  { name: "Lentejas", categoryId: categoryMap["Despensa"] },
  { name: "Garbanzos", categoryId: categoryMap["Despensa"] },
  { name: "Judías blancas", categoryId: categoryMap["Despensa"] },
  { name: "Aceite de oliva", categoryId: categoryMap["Despensa"] },
  { name: "Aceite de girasol", categoryId: categoryMap["Despensa"] },
  { name: "Vinagre", categoryId: categoryMap["Despensa"] },
  { name: "Sal", categoryId: categoryMap["Despensa"] },
  { name: "Azúcar", categoryId: categoryMap["Despensa"] },
  { name: "Harina", categoryId: categoryMap["Despensa"] },
  { name: "Levadura", categoryId: categoryMap["Despensa"] },
  { name: "Tomate frito", categoryId: categoryMap["Despensa"] },
  { name: "Salsa barbacoa", categoryId: categoryMap["Despensa"] },
  { name: "Mayonesa", categoryId: categoryMap["Despensa"] },
  { name: "Ketchup", categoryId: categoryMap["Despensa"] },
  { name: "Mermelada", categoryId: categoryMap["Despensa"] },
  { name: "Crema de cacahuete", categoryId: categoryMap["Despensa"] },
  { name: "Crema de almendra", categoryId: categoryMap["Despensa"] },
  { name: "Café en cápsulas", categoryId: categoryMap["Despensa"] },
  { name: "Café molido", categoryId: categoryMap["Despensa"] },
  { name: "Café en grano", categoryId: categoryMap["Despensa"] },
  { name: "Cacao en polvo", categoryId: categoryMap["Despensa"] },
  { name: "Cereales", categoryId: categoryMap["Despensa"] },
  { name: "Galletas", categoryId: categoryMap["Despensa"] },
   { name: "Atún en conserva", categoryId: categoryMap["Pescadería"] },

  /* ===================== BEBIDAS ===================== */
  { name: "Agua mineral", categoryId: categoryMap["Bebidas"] },
  { name: "Agua con gas", categoryId: categoryMap["Bebidas"] },
  { name: "Refresco de cola", categoryId: categoryMap["Bebidas"] },
  { name: "Refresco de naranja", categoryId: categoryMap["Bebidas"] },
  { name: "Zumo de naranja", categoryId: categoryMap["Bebidas"] },
  { name: "Zumo de piña", categoryId: categoryMap["Bebidas"] },
  { name: "Bebida isotónica", categoryId: categoryMap["Bebidas"] },
  { name: "Cerveza", categoryId: categoryMap["Bebidas"] },
  { name: "Vino tinto", categoryId: categoryMap["Bebidas"] },
  { name: "Vino blanco", categoryId: categoryMap["Bebidas"] },

  /* ===================== LIMPIEZA ===================== */
  { name: "Detergente", categoryId: categoryMap["Limpieza"] },
  { name: "Suavizante", categoryId: categoryMap["Limpieza"] },
  { name: "Lejía", categoryId: categoryMap["Limpieza"] },
  { name: "Amoniaco", categoryId: categoryMap["Limpieza"] },
  { name: "Limpiacristales", categoryId: categoryMap["Limpieza"] },
  { name: "Limpiador multiusos", categoryId: categoryMap["Limpieza"] },
  { name: "Friegasuelos", categoryId: categoryMap["Limpieza"] },
  { name: "Lavavajillas", categoryId: categoryMap["Limpieza"] },
  { name: "Pastillas lavavajillas", categoryId: categoryMap["Limpieza"] },
  { name: "Estropajos", categoryId: categoryMap["Limpieza"] },

  /* ===================== BEBE ===================== */
  { name: "Pañales", categoryId: categoryMap["Bebé"] },
  { name: "Toallitas de bebé", categoryId: categoryMap["Bebé"] },

  /* ===================== HIGIENE ===================== */
  { name: "Gel de ducha", categoryId: categoryMap["Higiene"] },
  { name: "Champú", categoryId: categoryMap["Higiene"] },
  { name: "Acondicionador", categoryId: categoryMap["Higiene"] },
  { name: "Pasta de dientes", categoryId: categoryMap["Higiene"] },
  { name: "Cepillo de dientes", categoryId: categoryMap["Higiene"] },
  { name: "Enjuague bucal", categoryId: categoryMap["Higiene"] },
  { name: "Desodorante", categoryId: categoryMap["Higiene"] },
  { name: "Papel higiénico", categoryId: categoryMap["Higiene"] },
  { name: "Toallitas húmedas", categoryId: categoryMap["Higiene"] },
  { name: "Cuchillas de afeitar", categoryId: categoryMap["Higiene"] },
  { name: "Crema de afeitar", categoryId: categoryMap["Higiene"] },

/* ===================== MASCOTAS ===================== */
  { name: "Pienso de perro", categoryId: categoryMap["Mascotas"] },
  { name: "Pienso de gato", categoryId: categoryMap["Mascotas"] },

    ],
    skipDuplicates: true,
  });

  console.log("✔ Products seeded");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
