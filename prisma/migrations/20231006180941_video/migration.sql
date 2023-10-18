/*
  Warnings:

  - You are about to drop the column `graphics_card` on the `Notebook` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notebook" DROP COLUMN "graphics_card",
ADD COLUMN     "video" TEXT;
