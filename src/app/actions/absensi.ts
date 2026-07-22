'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getAtauBuatPertemuan(tanggalStr: string, sesi: string) {
  try {
    // Pastikan tanggal hanya membandingkan YYYY-MM-DD
    const date = new Date(tanggalStr);
    date.setUTCHours(0, 0, 0, 0);

    let pertemuan = await prisma.pertemuan.findUnique({
      where: {
        tanggal_sesi: {
          tanggal: date,
          sesi,
        }
      },
      include: {
        kehadiran: true,
      }
    });

    if (!pertemuan) {
      // Belum ada, return null agar UI tahu dan bisa minta user klik "Mulai Absensi"
      return null;
    }

    return pertemuan;
  } catch (error) {
    console.error('Error fetching pertemuan:', error);
    return null;
  }
}

export async function mulaiAbsensi(tanggalStr: string, sesi: string) {
  try {
    const date = new Date(tanggalStr);
    date.setUTCHours(0, 0, 0, 0);

    // Ambil semua anggota aktif
    const anggotaAktif = await prisma.anggota.findMany({
      where: { status: 'Aktif' },
      select: { id: true },
    });

    // Buat pertemuan sekaligus data kehadiran default (A - Alpha)
    const pertemuan = await prisma.pertemuan.create({
      data: {
        tanggal: date,
        sesi,
        kehadiran: {
          create: anggotaAktif.map(a => ({
            anggotaId: a.id,
            status: 'A', // Default Alpha
          })),
        }
      },
      include: {
        kehadiran: true,
      }
    });

    revalidatePath('/absensi');
    return pertemuan;
  } catch (error) {
    console.error('Error memulai absensi:', error);
    throw new Error('Gagal memulai absensi');
  }
}

export async function simpanAbsensi(pertemuanId: string, dataKehadiran: { anggotaId: string, status: string }[]) {
  try {
    // Karena Prisma tidak punya API bulk update, kita gunakan transaction
    const updates = dataKehadiran.map(k => 
      prisma.kehadiran.upsert({
        where: {
          pertemuanId_anggotaId: {
            pertemuanId,
            anggotaId: k.anggotaId,
          }
        },
        update: {
          status: k.status,
        },
        create: {
          pertemuanId,
          anggotaId: k.anggotaId,
          status: k.status,
        }
      })
    );

    await prisma.$transaction(updates);

    revalidatePath('/absensi');
    return { success: true };
  } catch (error) {
    console.error('Error menyimpan absensi:', error);
    return { success: false, error: 'Gagal menyimpan data absensi' };
  }
}
