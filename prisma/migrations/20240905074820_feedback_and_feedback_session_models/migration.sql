-- CreateTable
CREATE TABLE "Feedback" (
    "feedbackID" SERIAL NOT NULL,
    "feedbackUUID" TEXT NOT NULL,
    "feedbackText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("feedbackID")
);

-- CreateTable
CREATE TABLE "FeedbackSession" (
    "feedbackSessionID" SERIAL NOT NULL,
    "feedbackSessionUUID" TEXT NOT NULL,
    "userUUID" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedbackSession_pkey" PRIMARY KEY ("feedbackSessionID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_feedbackUUID_key" ON "Feedback"("feedbackUUID");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackSession_feedbackSessionUUID_key" ON "FeedbackSession"("feedbackSessionUUID");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackSession_userUUID_key" ON "FeedbackSession"("userUUID");

-- AddForeignKey
ALTER TABLE "FeedbackSession" ADD CONSTRAINT "FeedbackSession_userUUID_fkey" FOREIGN KEY ("userUUID") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
