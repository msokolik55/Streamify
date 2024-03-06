/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `Stream` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Stream_path_key" ON "Stream"("path");
