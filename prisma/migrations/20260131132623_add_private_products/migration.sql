/*
  Warnings:

  - A unique constraint covering the columns `[name,category_id,user_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "products_name_category_id_key";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "user_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "products_name_category_id_user_id_key" ON "products"("name", "category_id", "user_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
