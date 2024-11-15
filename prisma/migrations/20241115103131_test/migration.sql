-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sendReminders" BOOLEAN NOT NULL,
    "userUUID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anniversary" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "userUUID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Anniversary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfilePicture" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "userUUID" TEXT NOT NULL,
    "thumbnail" BYTEA NOT NULL,
    "picture" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfilePicture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_uuid_key" ON "Person"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Person_userUUID_key" ON "Person"("userUUID");

-- CreateIndex
CREATE UNIQUE INDEX "Anniversary_uuid_key" ON "Anniversary"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePicture_uuid_key" ON "ProfilePicture"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePicture_userUUID_key" ON "ProfilePicture"("userUUID");

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "picture_fk" FOREIGN KEY ("userUUID") REFERENCES "ProfilePicture"("userUUID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "user_fk" FOREIGN KEY ("userUUID") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anniversary" ADD CONSTRAINT "Anniversary_userUUID_fkey" FOREIGN KEY ("userUUID") REFERENCES "Person"("userUUID") ON DELETE CASCADE ON UPDATE CASCADE;
