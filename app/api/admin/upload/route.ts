import { put } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getAdminIdentity } from "@/lib/admin-auth";

export const runtime = "nodejs";

const MAX_BYTES = 3_500_000;
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function hasValidSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  if (file.type === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (file.type === "image/png") {
    const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return signature.every((value, index) => bytes[index] === value);
  }

  if (file.type === "image/webp") {
    return (
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
    );
  }

  return false;
}

async function saveLocallyForDevelopment(file: File, extension: string) {
  const filename = `${crypto.randomUUID()}.${extension}`;
  const relativeUrl = `/uploads/services/${filename}`;
  const directory = path.join(process.cwd(), "public", "uploads", "services");
  const absolutePath = path.join(directory, filename);

  await mkdir(directory, { recursive: true });
  await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()));

  return relativeUrl;
}

function publicPrivateBlobRoute(pathname: string) {
  return `/api/media/service/${pathname
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

function isStoreAccessMismatch(error: unknown, expected: "private" | "public") {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (expected === "private") {
    return message.includes("cannot use private access on a public store");
  }
  return message.includes("cannot use public access on a private store");
}

async function uploadToConfiguredBlob(
  pathname: string,
  file: File,
): Promise<{ url: string; storage: string }> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  try {
    // Primero probamos PRIVATE porque el store actual de Hay Pique está configurado así.
    const blob = await put(pathname, file, {
      access: "private",
      addRandomSuffix: false,
      token,
    });

    return {
      url: publicPrivateBlobRoute(blob.pathname),
      storage: "vercel-blob-private",
    };
  } catch (error) {
    // Si en algún momento el store se cambia a PUBLIC, no rompe el panel:
    // reintentamos automáticamente con el tipo correcto.
    if (!isStoreAccessMismatch(error, "private")) {
      throw error;
    }

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
      token,
    });

    return {
      url: blob.url,
      storage: "vercel-blob-public",
    };
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getAdminIdentity();

    if (!admin) {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    const origin = request.headers.get("origin");
    const requestOrigin = new URL(request.url).origin;

    if (origin && origin !== requestOrigin) {
      return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No se recibió ninguna imagen." },
        { status: 400 },
      );
    }

    const extension = EXTENSIONS[file.type];

    if (!extension) {
      return NextResponse.json(
        { error: "Usá una imagen JPG, PNG o WEBP." },
        { status: 400 },
      );
    }

    if (file.size <= 0 || file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "La imagen debe pesar menos de 3,5 MB." },
        { status: 400 },
      );
    }

    if (!(await hasValidSignature(file))) {
      return NextResponse.json(
        { error: "El archivo no parece ser una imagen válida." },
        { status: 400 },
      );
    }

    /*
     * Si no hay credenciales de Blob y estamos en desarrollo, guardamos
     * localmente para no bloquear las pruebas.
     *
     * Si BLOB_READ_WRITE_TOKEN existe, usamos el store conectado aunque
     * estemos ejecutando npm run dev.
     */
    if (
      process.env.NODE_ENV !== "production" &&
      !process.env.BLOB_READ_WRITE_TOKEN &&
      !process.env.VERCEL_OIDC_TOKEN
    ) {
      const url = await saveLocallyForDevelopment(file, extension);
      return NextResponse.json({ url, storage: "local-dev" });
    }

    const pathname = `hay-pique/servicios/${crypto.randomUUID()}.${extension}`;
    const uploaded = await uploadToConfiguredBlob(pathname, file);

    return NextResponse.json(uploaded);
  } catch (error) {
    console.error("service-image-upload", error);

    return NextResponse.json(
      {
        error:
          "No se pudo subir la imagen. El panel detectó el almacenamiento, pero Vercel Blob rechazó la operación.",
      },
      { status: 500 },
    );
  }
}
