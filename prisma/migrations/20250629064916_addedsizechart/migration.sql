-- CreateTable
CREATE TABLE "TshirtSize" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "chest" TEXT NOT NULL,
    "len" TEXT NOT NULL,
    "sh" TEXT NOT NULL,
    "slv" TEXT NOT NULL,

    CONSTRAINT "TshirtSize_pkey" PRIMARY KEY ("id")
);
