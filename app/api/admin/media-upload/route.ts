import { issueSignedToken, presignUrl } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminIdentity } from "@/lib/admin-auth";

export const runtime = "nodejs";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const VIDEO_TYPES = ["video/mp4", "video/webm"] as const;
const IMAGE_MAX = 40 * 1024 * 1024;
const VIDEO_MAX = 500 * 1024 * 1024;

const requestSchema = z.object({
  pathname: z.string().max(500),
  kind: z.enum(["image", "video"]),
  contentType: z.string().max(100),
  size: z.number().int().positive(),
});

const imagePath =
  /^hay-pique\/servicios\/images\/[a-f0-9-]+\.(?:jpg|png|webp)$/i;
const videoPath =
  /^hay-pique\/servicios\/videos\/[a-f0-9-]+\.(?:mp4|webm)$/i;

export async function POST(request: Request) {
  const admin = await getAdminIdentity();

  if (!admin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;

  if (origin && origin !== requestOrigin) {
    return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
  }

  try {
    const parsed = requestSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Solicitud de carga inválida." }, { status: 400 });
    }

    const { pathname, kind, contentType, size } = parsed.data;
    const allowedTypes = kind === "image" ? IMAGE_TYPES : VIDEO_TYPES;
    const maxBytes = kind === "image" ? IMAGE_MAX : VIDEO_MAX;

    if (kind === "image" && !imagePath.test(pathname)) {
      return NextResponse.json({ error: "Ruta de imagen inválida." }, { status: 400 });
    }

    if (kind === "video" && !videoPath.test(pathname)) {
      return NextResponse.json({ error: "Ruta de video inválida." }, { status: 400 });
    }

    if (!(allowedTypes as readonly string[]).includes(contentType)) {
      return NextResponse.json({ error: "Formato no admitido." }, { status: 400 });
    }

    if (size > maxBytes) {
      return NextResponse.json(
        {
          error:
            kind === "image"
              ? "Cada imagen puede pesar hasta 40 MB."
              : "Cada video puede pesar hasta 500 MB.",
        },
        { status: 400 },
      );
    }

    const validUntil = Date.now() + 15 * 60 * 1000;
    const signedToken = await issueSignedToken({
      pathname,
      operations: ["put"],
      validUntil,
      allowedContentTypes: [contentType],
      maximumSizeInBytes: maxBytes,
    });

    const { presignedUrl } = await presignUrl(signedToken, {
      operation: "put",
      pathname,
      access: "private",
      validUntil,
      allowedContentTypes: [contentType],
      maximumSizeInBytes: maxBytes,
      addRandomSuffix: false,
      allowOverwrite: false,
    });

    return NextResponse.json({
      uploadUrl: presignedUrl,
      pathname,
    });
  } catch (error) {
    console.error("media-upload-sign", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo iniciar la carga." },
      { status: 400 },
    );
  }
}
