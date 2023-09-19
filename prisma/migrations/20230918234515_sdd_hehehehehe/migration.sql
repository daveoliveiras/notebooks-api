/*
  Warnings:

  - You are about to drop the column `sdd` on the `Notebook` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notebook" DROP COLUMN "sdd",
ADD COLUMN     "ssd" INTEGER;
