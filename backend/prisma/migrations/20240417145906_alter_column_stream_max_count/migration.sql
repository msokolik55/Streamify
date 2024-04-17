/*
  Warnings:

  - You are about to drop the column `count` on the `Stream` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stream" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "maxCount" INTEGER NOT NULL DEFAULT 0,
    "ended" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Stream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Stream" ("createdAt", "description", "ended", "id", "name", "path", "updatedAt", "userId") SELECT "createdAt", "description", "ended", "id", "name", "path", "updatedAt", "userId" FROM "Stream";
DROP TABLE "Stream";
ALTER TABLE "new_Stream" RENAME TO "Stream";
CREATE UNIQUE INDEX "Stream_path_key" ON "Stream"("path");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
