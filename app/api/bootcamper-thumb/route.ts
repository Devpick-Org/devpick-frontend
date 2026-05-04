import { NextRequest, NextResponse } from "next/server";

const BOOTCAMP_ORIGIN = "https://bootcamper.co.kr";
const FETCH_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function isValidUploadLoaderPath(p: string): boolean {
  return p.startsWith("/uploads/") && !p.includes("..");
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("path");
  if (!raw) {
    return new NextResponse("Missing path", { status: 400 });
  }

  let uploadPath = raw;
  try {
    uploadPath = decodeURIComponent(raw);
  } catch {
    uploadPath = raw;
  }

  if (!isValidUploadLoaderPath(uploadPath)) {
    return new NextResponse("Invalid path", { status: 400 });
  }

  const urlParam = encodeURIComponent(uploadPath);
  const upstreamUrl = `${BOOTCAMP_ORIGIN}/_next/image?url=${urlParam}&w=640&q=75`;

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      headers: {
        "User-Agent": FETCH_UA,
        Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
        Referer: `${BOOTCAMP_ORIGIN}/class`,
      },
      signal: AbortSignal.timeout(45_000),
    });
  } catch {
    return new NextResponse("Upstream timeout", { status: 504 });
  }

  if (!upstream.ok || !upstream.body) {
    return new NextResponse("Upstream error", { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
