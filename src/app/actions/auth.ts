'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'pastemda-super-secret-key-2026');

export async function login(username: string, passwordStr: string) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      return { success: false, error: 'Username atau password salah' };
    }

    const isValid = await bcrypt.compare(passwordStr, admin.password);
    if (!isValid) {
      return { success: false, error: 'Username atau password salah' };
    }

    // Create JWT
    const token = await new SignJWT({ sub: admin.id, username: admin.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('10y')
      .sign(JWT_SECRET);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 10 // 10 years
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Terjadi kesalahan sistem' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  return { success: true };
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) return null;

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload;
  } catch (err) {
    return null;
  }
}
