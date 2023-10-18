-- AlterTable
ALTER TABLE "Notebook" ADD COLUMN     "userUid" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- AddForeignKey
ALTER TABLE "Notebook" ADD CONSTRAINT "Notebook_userUid_fkey" FOREIGN KEY ("userUid") REFERENCES "User"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
