/*
  Warnings:

  - The `aiCategory` column on the `Complaint` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Complaint" DROP COLUMN "aiCategory",
ADD COLUMN     "aiCategory" TEXT;
