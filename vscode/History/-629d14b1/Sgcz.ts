import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/recruiter(.*)', '/candidate(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn, sessionClaims } = await auth();
  const { pathname } = req.nextUrl;

  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  const userRole = sessionClaims?.role;

  // role base routing for protected route
  if (pathname.startsWith('/admin')) {
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL(`/${userRole}`, req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/recruiter')) {
    if (userRole !== 'recruiter') {
      return NextResponse.redirect(new URL(`/${userRole}`, req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/candidate')) {
    if (userRole !== 'candidate') {
      return NextResponse.redirect(new URL(`/${userRole}`, req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
