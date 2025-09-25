-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "repostId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_repostId_fkey" FOREIGN KEY ("repostId") REFERENCES "public"."Repost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
