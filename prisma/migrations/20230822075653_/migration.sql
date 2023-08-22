/*
  Warnings:

  - You are about to drop the `Interaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `login` to the `ApiKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `ApiKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `server` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_apiKeyId_fkey";

-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_userId_fkey";

-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "login" INTEGER NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "server" TEXT NOT NULL;

-- DropTable
DROP TABLE "Interaction";
