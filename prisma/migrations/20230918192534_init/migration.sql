-- CreateTable
CREATE TABLE "Notebook" (
    "id" INTEGER NOT NULL,
    "ram" INTEGER NOT NULL,
    "ddr" INTEGER NOT NULL,
    "hd" INTEGER,
    "sdd" INTEGER,
    "graphics_card" TEXT,
    "model" TEXT NOT NULL,
    "note" TEXT,
    "resolution" TEXT NOT NULL,
    "inch" DOUBLE PRECISION,
    "touch" BOOLEAN NOT NULL,
    "clock" DOUBLE PRECISION NOT NULL,
    "processor_brand" TEXT NOT NULL,
    "processor_model" TEXT NOT NULL,
    "brandId" INTEGER NOT NULL,
    "systemId" INTEGER NOT NULL,

    CONSTRAINT "Notebook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "System" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "System_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "notebookId" INTEGER,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Photo_id_key" ON "Photo"("id");

-- AddForeignKey
ALTER TABLE "Notebook" ADD CONSTRAINT "Notebook_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "System"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notebook" ADD CONSTRAINT "Notebook_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE SET NULL ON UPDATE CASCADE;
