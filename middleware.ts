import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ROUTES } from "./config/routes";

const PUBLIC_PATHS = ["/login", "/signup", "/auth", "/error", "/_next"];

function createSupabaseClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {},
      },
    }
  );
}

function redirectTo(url: string, request: NextRequest) {
  const newUrl = request.nextUrl.clone();
  newUrl.pathname = url;
  return NextResponse.redirect(newUrl);
}

async function getUserProfile(supabase: any, userId: string) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return profile?.role ?? null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supabase = createSupabaseClient(request);

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isPublicPath) {
    if (user && isAuthPage) {
      const role = await getUserProfile(supabase, user.id);
      const home = role === "admin" ? ROUTES.ADMIN.ADM : ROUTES.STUDENT.STUDENT;

      return redirectTo(home, request);
    }

    return NextResponse.next();
  }

  if (!user) {
    return redirectTo(ROUTES.LOGIN, request);
  }

  const role = await getUserProfile(supabase, user.id);

  if (pathname === "/") {
    const home = role === "admin" ? ROUTES.ADMIN.ADM : ROUTES.STUDENT.STUDENT;

    return redirectTo(home, request);
  }

  const isAdminPath = pathname.startsWith("/admin");
  const isStudentPath = pathname.startsWith("/student");

  if (isAdminPath && role !== "admin") {
    return redirectTo(ROUTES.STUDENT.STUDENT, request);
  }

  if (isStudentPath && role !== "student") {
    return redirectTo(ROUTES.ADMIN.ADM, request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
    "/login",
    "/signup",
    "/",
  ],
};