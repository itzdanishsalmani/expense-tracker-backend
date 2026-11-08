/*
  Warnings:

  - The values [GROCERY,OTHER] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('TRANSPORT', 'FOOD', 'SHOPPING', 'BILLS', 'ENTERTAINMENT', 'HEALTH', 'TRAVEL', 'OTHERS');
ALTER TABLE "Expense" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "public"."Category_old";
COMMIT;
