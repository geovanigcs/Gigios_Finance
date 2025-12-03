-- AlterTable: Remove age and address columns if they exist
ALTER TABLE "User" DROP COLUMN IF EXISTS "age";
ALTER TABLE "User" DROP COLUMN IF EXISTS "address";