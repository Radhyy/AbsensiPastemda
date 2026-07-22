import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'pastemda-super-secret-key-2026');

// Daftar rute yang harus diproteksi
const protectedRoutes = ['/', '/absensi', '/anggota', '/laporan'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cek apakah rute saat ini termasuk dalam protected routes
  const isProtected = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`) && route !== '/'
  );

  const isLoginPage = pathname === '/login';

  const token = request.cookies.get('session')?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch (err) {
      isAuthenticated = false;
    }
  }

  // Jika belum login dan mencoba akses halaman admin
  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah login dan mencoba akses halaman login
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
