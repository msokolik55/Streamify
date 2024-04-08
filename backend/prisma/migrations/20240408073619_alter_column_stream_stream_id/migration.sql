/*
  Warnings:

  - You are about to drop the column `streamId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `streamKey` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "streamKey" TEXT NOT NULL,
    "username" TEXT,
    CONSTRAINT "Message_streamKey_fkey" FOREIGN KEY ("streamKey") REFERENCES "Stream" ("path") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_username_fkey" FOREIGN KEY ("username") REFERENCES "User" ("username") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("content", "createdAt", "id", "username") SELECT "content", "createdAt", "id", "username" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
