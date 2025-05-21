
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const protectedRoutes = [ "/cart"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
   
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher:protectedRoutes,
};
