-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "checkoutRequestId" TEXT NOT NULL,
    "merchantRequestId" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "accountReference" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "mpesaReceiptNumber" TEXT,
    "transactionDate" TIMESTAMP(3),
    "userId" TEXT,
    "courseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_checkoutRequestId_key" ON "payments"("checkoutRequestId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
