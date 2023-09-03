-- CreateTable
CREATE TABLE `partidos_politicos` (
    `id_partido_politico` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `siglas` VARCHAR(20) NOT NULL,
    `logo` TEXT NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modificado_en` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_partido_politico`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `candidatos_politicos` (
    `id_candidato` INTEGER NOT NULL AUTO_INCREMENT,
    `foto_candidato` TEXT NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modificado_en` DATETIME(3) NOT NULL,
    `id_partido_politico` INTEGER NOT NULL,
    `id_persona_natural` INTEGER NULL,

    PRIMARY KEY (`id_candidato`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personas_naturales` (
    `id_persona_natural` INTEGER NOT NULL AUTO_INCREMENT,
    `dui` VARCHAR(10) NOT NULL,
    `nombres` VARCHAR(150) NOT NULL,
    `apellidos` VARCHAR(150) NOT NULL,
    `genero` ENUM('MASCULINO', 'FEMENINO') NOT NULL,
    `id_municipio` INTEGER NOT NULL,
    `detalle_direccion` TEXT NOT NULL,
    `fecha_nacimiento` DATETIME(3) NOT NULL,
    `fecha_vencidmiento_dui` DATETIME(3) NOT NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modificado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `personas_naturales_dui_key`(`dui`),
    PRIMARY KEY (`id_persona_natural`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departamentos` (
    `id_departamento` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,

    PRIMARY KEY (`id_departamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `municipios` (
    `id_municipio` INTEGER NOT NULL AUTO_INCREMENT,
    `id_departamento` INTEGER NOT NULL,
    `nombre` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_municipio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id_rol` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modificado` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_nombre_key`(`nombre`),
    PRIMARY KEY (`id_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario` VARCHAR(191) NOT NULL,
    `correo_electronico` VARCHAR(191) NOT NULL,
    `clave` TEXT NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modificado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_usuario_key`(`usuario`),
    UNIQUE INDEX `usuarios_correo_electronico_key`(`correo_electronico`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `centros_votacion` (
    `id_centro_votacion` INTEGER NOT NULL AUTO_INCREMENT,
    `id_municipio` INTEGER NOT NULL,
    `nombre` VARCHAR(255) NOT NULL,
    `direccion` TEXT NOT NULL,
    `estado` ENUM('ABIERTA', 'CERRADA') NOT NULL DEFAULT 'CERRADA',
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modificado` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_centro_votacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `junta_receptora_votos` (
    `id_jrv` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(10) NOT NULL,
    `estado` ENUM('ABIERTA', 'CERRADA') NOT NULL DEFAULT 'CERRADA',
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modificado` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_jrv`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jrv_centro_votacion` (
    `id_jrv` INTEGER NOT NULL AUTO_INCREMENT,
    `id_centro_votacion` INTEGER NOT NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modificado` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_jrv`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jrv_miembros` (
    `id_jrv_miembro` INTEGER NOT NULL AUTO_INCREMENT,
    `id_jrv` INTEGER NOT NULL,
    `id_persona_natural` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modificado` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_jrv_miembro`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detalles_sufragio` (
    `id_detalle_sufragio` INTEGER NOT NULL AUTO_INCREMENT,
    `id_personas_natural` INTEGER NOT NULL,
    `id_jrv` INTEGER NOT NULL,
    `supervisado_por` INTEGER NULL,
    `asistio_en` DATETIME(3) NULL,
    `estado_voto` ENUM('SIN_EMITIR', 'EMITIDO') NOT NULL DEFAULT 'SIN_EMITIR',
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modificado_en` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_detalle_sufragio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `candidatos_politicos` ADD CONSTRAINT `candidatos_politicos_id_partido_politico_fkey` FOREIGN KEY (`id_partido_politico`) REFERENCES `partidos_politicos`(`id_partido_politico`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `candidatos_politicos` ADD CONSTRAINT `candidatos_politicos_id_persona_natural_fkey` FOREIGN KEY (`id_persona_natural`) REFERENCES `personas_naturales`(`id_persona_natural`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `personas_naturales` ADD CONSTRAINT `personas_naturales_id_municipio_fkey` FOREIGN KEY (`id_municipio`) REFERENCES `municipios`(`id_municipio`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `municipios` ADD CONSTRAINT `municipios_id_departamento_fkey` FOREIGN KEY (`id_departamento`) REFERENCES `departamentos`(`id_departamento`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `centros_votacion` ADD CONSTRAINT `centros_votacion_id_municipio_fkey` FOREIGN KEY (`id_municipio`) REFERENCES `municipios`(`id_municipio`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jrv_centro_votacion` ADD CONSTRAINT `jrv_centro_votacion_id_centro_votacion_fkey` FOREIGN KEY (`id_centro_votacion`) REFERENCES `centros_votacion`(`id_centro_votacion`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jrv_centro_votacion` ADD CONSTRAINT `jrv_centro_votacion_id_jrv_fkey` FOREIGN KEY (`id_jrv`) REFERENCES `junta_receptora_votos`(`id_jrv`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jrv_miembros` ADD CONSTRAINT `jrv_miembros_id_jrv_fkey` FOREIGN KEY (`id_jrv`) REFERENCES `junta_receptora_votos`(`id_jrv`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jrv_miembros` ADD CONSTRAINT `jrv_miembros_id_persona_natural_fkey` FOREIGN KEY (`id_persona_natural`) REFERENCES `personas_naturales`(`id_persona_natural`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jrv_miembros` ADD CONSTRAINT `jrv_miembros_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detalles_sufragio` ADD CONSTRAINT `detalles_sufragio_id_jrv_fkey` FOREIGN KEY (`id_jrv`) REFERENCES `junta_receptora_votos`(`id_jrv`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detalles_sufragio` ADD CONSTRAINT `detalles_sufragio_id_personas_natural_fkey` FOREIGN KEY (`id_personas_natural`) REFERENCES `personas_naturales`(`id_persona_natural`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detalles_sufragio` ADD CONSTRAINT `detalles_sufragio_supervisado_por_fkey` FOREIGN KEY (`supervisado_por`) REFERENCES `jrv_miembros`(`id_jrv_miembro`) ON DELETE SET NULL ON UPDATE CASCADE;
