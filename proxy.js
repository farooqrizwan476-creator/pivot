import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// 1. Un rasto (routes) ki list banayen jinhein protect karna hai
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/resume(.*)',
  '/interview(.*)',
  '/ai-cover-letter(.*)',
  '/onboarding(.*)'
]);

// 2. Middleware check karega ke user login hai ya nahi
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Agar user login nahi hai aur protected page par jane ki koshish kare
  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn(); // Usay wapis Sign In page par bhej do
  }

  return NextResponse.next();
});

// 3. Configuration (Yeh waisi hi rahegi)
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};