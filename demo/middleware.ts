import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // This is specific to Vercel deployments
  response.headers.set("x-vercel-set-bypass-cookie", "samesitenone")

  return response
}

export const config = {
  matcher: "/:path*",
}
