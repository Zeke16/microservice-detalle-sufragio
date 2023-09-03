/*
  Warnings:

  - Added the required column `colores` to the `partidos_politicos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ideologia` to the `partidos_politicos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `partidos_politicos` ADD COLUMN `Posicion` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `colores` TEXT NOT NULL,
    ADD COLUMN `ideologia` ENUM('IZQUIERDA', 'CENTRO_IZQUIERDA', 'CENTRO', 'CENTRO_DERECHA', 'DERECHA') NOT NULL;
