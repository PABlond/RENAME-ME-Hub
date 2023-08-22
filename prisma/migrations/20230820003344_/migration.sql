-- AlterTable
ALTER TABLE "Interaction" ADD COLUMN     "apiKeyId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
