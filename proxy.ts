import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/admin(.*)",
    "/sign-in(.*)",
    "/sin-acceso",
    "/api/admin(.*)",
  ],
};
