/*
  Warnings:

  - A unique constraint covering the columns `[authorId,postId]` on the table `Repost` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Repost_authorId_postId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Repost_authorId_postId_key" ON "public"."Repost"("authorId", "postId");
