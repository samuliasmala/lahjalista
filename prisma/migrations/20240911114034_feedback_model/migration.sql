-- CreateTable
CREATE TABLE "Feedback" (
    "feedbackID" SERIAL NOT NULL,
    "feedbackUUID" TEXT NOT NULL,
    "feedbackText" TEXT NOT NULL,
    "userUUID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("feedbackID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_feedbackUUID_key" ON "Feedback"("feedbackUUID");

-- CreateIndex
-- CREATE UNIQUE INDEX "Feedback_userUUID_key" ON "Feedback"("userUUID");

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userUUID_fkey" FOREIGN KEY ("userUUID") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
