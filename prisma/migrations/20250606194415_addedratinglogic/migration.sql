-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ratedProductIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
