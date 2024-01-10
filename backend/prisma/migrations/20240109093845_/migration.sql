-- RedefineIndex
DROP INDEX "User_name_key";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
