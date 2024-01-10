/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
ALTER TABLE "User" RENAME "name" TO "username";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
