/*
  Warnings:

  - You are about to drop the column `colores` on the `partidos_politicos` table. All the data in the column will be lost.
  - You are about to drop the column `ideologia` on the `partidos_politicos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `partidos_politicos` DROP COLUMN `colores`,
    DROP COLUMN `ideologia`;
