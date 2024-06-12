-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "feedbackText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackSession" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "userUUID" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedbackSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_uuid_key" ON "Feedback"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackSession_uuid_key" ON "FeedbackSession"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackSession_userUUID_key" ON "FeedbackSession"("userUUID");

-- AddForeignKey
ALTER TABLE "FeedbackSession" ADD CONSTRAINT "FeedbackSession_userUUID_fkey" FOREIGN KEY ("userUUID") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
