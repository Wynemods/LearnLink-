/*
  Warnings:

  - You are about to drop the column `authorId` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `transactionDate` on the `payments` table. All the data in the column will be lost.
  - The `status` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[courseId,userId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseId` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `assignments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "assignments" DROP CONSTRAINT "assignments_authorId_fkey";

-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_courseId_fkey";

-- DropIndex
DROP INDEX "reviews_userId_courseId_key";

-- DropIndex
DROP INDEX "submissions_studentId_assignmentId_key";

-- AlterTable
ALTER TABLE "assignments" DROP COLUMN "authorId",
ADD COLUMN     "courseId" TEXT NOT NULL,
ADD COLUMN     "createdBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "courseContent" TEXT[],
ADD COLUMN     "courseRequirements" TEXT[],
ADD COLUMN     "curriculum" JSONB,
ADD COLUMN     "instructorBio" TEXT,
ADD COLUMN     "instructorExperience" TEXT,
ADD COLUMN     "instructorRating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "targetAudience" TEXT[],
ADD COLUMN     "totalDuration" TEXT,
ADD COLUMN     "totalLectures" INTEGER DEFAULT 0,
ADD COLUMN     "totalSections" INTEGER DEFAULT 0,
ADD COLUMN     "whatYouLearn" TEXT[];

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "transactionDate",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'KES',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'MPESA',
ADD COLUMN     "resultCode" INTEGER,
ADD COLUMN     "resultDescription" TEXT,
ADD COLUMN     "transactionId" TEXT,
ALTER COLUMN "checkoutRequestId" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "gradedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "reviews_courseId_userId_key" ON "reviews"("courseId", "userId");

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
