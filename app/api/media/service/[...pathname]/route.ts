import { issueSignedToken, presignUrl } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ALLOWED_PATH =
  /^hay-pique\/servicios\/(?:(?:images\/[a-f0-9-]+\.(?:jpg|png|webp))|(?:videos\/[a-f0-9-]+\.(?:mp4|webm))|(?:[a-f0-9-]+\.(?:jpg|png|webp)))$/i;

const tokenCache = new Map<string, { token: Awaited<ReturnType<typeof issueSignedToken>>; expires: number }>();

async function getToken(pathname: string) {
  const now = Date.now();
  const cached = tokenCache.get(pathname);
  if (cached && cached.expires > now + 5 * 60 * 1000) return cached.token;

  const expires = now + 55 * 60 * 1000;
  const token = await issueSignedToken({
    pathname,
    operations: ["get"],
    validUntil: expires,
  });

  if (tokenCache.size > 100) tokenCache.clear();
  tokenCache.set(pathname, { token, expires });
  return token;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pathname: string[] }> },
) {
  const { pathname: parts } = await params;
  const pathname = parts.map((part) => decodeURIComponent(part)).join("/");
  if (!ALLOWED_PATH.test(pathname)) return new NextResponse("Not found", { status: 404 });

  try {
    const token = await getToken(pathname);
    const { presignedUrl } = await presignUrl(token, {
      operation: "get",
      pathname,
      access: "private",
      validUntil: Date.now() + 10 * 60 * 1000,
    });

    const response = NextResponse.redirect(presignedUrl, 307);
    response.headers.set("Cache-Control", "public, max-age=240, s-maxage=240");
    response.headers.set("X-Content-Type-Options", "nosniff");
    return response;
  } catch (error) {
    console.error("service-media-read", error);
    return new NextResponse("Not found", { status: 404 });
  }
}
