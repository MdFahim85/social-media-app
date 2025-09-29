-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "banner" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "birthday" TIMESTAMP(3),
ADD COLUMN     "location" TEXT,
ADD COLUMN     "password" TEXT;
