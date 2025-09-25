-- CreateIndex
CREATE INDEX "Repost_authorId_postId_idx" ON "public"."Repost"("authorId", "postId");
