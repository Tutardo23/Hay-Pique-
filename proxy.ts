import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/admin(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/sin-acceso",
    "/api/admin(.*)",
  ],
};
