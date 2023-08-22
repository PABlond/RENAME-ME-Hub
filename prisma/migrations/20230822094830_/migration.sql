/*
  Warnings:

  - A unique constraint covering the columns `[ip]` on the table `Container` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Container_ip_key" ON "Container"("ip");
