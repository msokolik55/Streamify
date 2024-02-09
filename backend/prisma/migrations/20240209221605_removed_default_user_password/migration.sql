-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "picture" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "streamKey" TEXT
);
INSERT INTO "new_User" ("count", "createdAt", "email", "id", "password", "picture", "streamKey", "updatedAt", "username") SELECT "count", "createdAt", "email", "id", "password", "picture", "streamKey", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_streamKey_key" ON "User"("streamKey");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
