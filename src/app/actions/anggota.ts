'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSemuaAnggota() {
  try {
    const anggota = await prisma.anggota.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return anggota;
  } catch (error) {
    console.error('Error fetching anggota:', error);
    return [];
  }
}

export async function tambahAnggota(formData: FormData) {
  try {
    const nama = formData.get('nama') as string;
    const kelas = formData.get('kelas') as string;
    const jabatan = formData.get('jabatan') as string;

    if (!nama || !kelas || !jabatan) {
      throw new Error('Semua kolom harus diisi');
    }

    await prisma.anggota.create({
      data: {
        nama,
        kelas,
        jabatan,
        status: 'Aktif',
      },
    });

    revalidatePath('/anggota');
    return { success: true };
  } catch (error: any) {
    console.error('Error adding anggota:', error);
    return { success: false, error: error.message };
  }
}

export async function hapusAnggota(id: string) {
  try {
    await prisma.anggota.delete({
      where: { id },
    });
    revalidatePath('/anggota');
    return { success: true };
  } catch (error: any) {
    console.error('Error hapusAnggota:', error);
    return { success: false, error: 'Gagal menghapus anggota' };
  }
}

export async function editAnggota(id: string, formData: FormData) {
  try {
    const nama = formData.get('nama') as string;
    const kelas = formData.get('kelas') as string;
    const jabatan = formData.get('jabatan') as string;
    const status = formData.get('status') as string;

    if (!nama || !kelas || !jabatan || !status) {
      throw new Error('Semua kolom harus diisi');
    }

    await prisma.anggota.update({
      where: { id },
      data: {
        nama,
        kelas,
        jabatan,
        status,
      },
    });

    revalidatePath('/anggota');
    return { success: true };
  } catch (error: any) {
    console.error('Error editAnggota:', error);
    return { success: false, error: error.message };
  }
}
