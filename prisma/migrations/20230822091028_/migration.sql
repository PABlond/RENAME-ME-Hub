-- CreateEnum
CREATE TYPE "SUBSCRIPTION_TYPE" AS ENUM ('free', 'premium');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" "SUBSCRIPTION_TYPE" NOT NULL DEFAULT 'free';

-- CreateTable
CREATE TABLE "Container" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "type" "SUBSCRIPTION_TYPE" NOT NULL DEFAULT 'free',

    CONSTRAINT "Container_pkey" PRIMARY KEY ("id")
);
