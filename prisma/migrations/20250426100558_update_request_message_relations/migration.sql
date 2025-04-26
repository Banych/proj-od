-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_requestId_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
