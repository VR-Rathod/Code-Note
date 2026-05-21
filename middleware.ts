export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (Next.js internals)
     * - _vercel (Vercel internals)
     * - static (Quartz static assets)
     * - favicon.ico, sitemap.xml, robots.txt (common static files)
     */
    '/((?!api|_next|_vercel|static|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Handle c++ redirect (case-insensitive and decoded check)
  const decodedPath = decodeURIComponent(pathname).toLowerCase();
  if (decodedPath === "/c++" || decodedPath === "/c++/") {
    url.pathname = "/cpp";
    return Response.redirect(url, 308);
  }

  // If the path contains any uppercase letters, redirect to the lowercase version
  if (/[A-Z]/.test(pathname)) {
    url.pathname = pathname.toLowerCase();
    return Response.redirect(url, 308);
  }
}
