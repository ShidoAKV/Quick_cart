-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT 'https://th.bing.com/th/id/OIP.CuH_kp6AL_Z3CIZAfzPbmQHaGe?w=3683&h=3223&rs=1&pid=ImgDetMain',
    "cartItems" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
