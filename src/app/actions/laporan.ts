'use server';

import { prisma } from '@/lib/prisma';

export async function getLaporanBulanIni(tahunBulan?: string) {
  try {
    // Tentukan bulan dan tahun
    let targetDate = new Date();
    if (tahunBulan) {
      targetDate = new Date(tahunBulan); // e.g. "2026-08"
    }
    
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    // Ambil semua pertemuan bulan ini
    const pertemuanBulanIni = await prisma.pertemuan.findMany({
      where: {
        tanggal: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      include: {
        kehadiran: true
      }
    });

    // Ambil semua anggota aktif
    const semuaAnggota = await prisma.anggota.findMany({
      where: { status: 'Aktif' },
      orderBy: { nama: 'asc' }
    });

    const totalPertemuan = pertemuanBulanIni.length;

    // Susun data per anggota
    const rekap = semuaAnggota.map((anggota) => {
      let hadir = 0;
      let izin = 0;
      let alpha = 0;

      pertemuanBulanIni.forEach((pertemuan) => {
        const keH = pertemuan.kehadiran.find((k) => k.anggotaId === anggota.id);
        const status = keH?.status || 'A'; // Default Alpha jika tidak ada data absen di pertemuan tersebut
        if (status === 'H') hadir++;
        else if (status === 'I') izin++;
        else if (status === 'A') alpha++;
      });

      // Hitung persentase kehadiran (berdasarkan hadir dibagi total pertemuan)
      // Jika belum ada pertemuan, persentase default 100% atau 0%? Mari beri 0% jika belum ada pertemuan.
      let persentase = 0;
      if (totalPertemuan > 0) {
        persentase = Math.round((hadir / totalPertemuan) * 100);
      }

      return {
        id: anggota.id,
        nama: anggota.nama,
        kelas: anggota.kelas,
        jabatan: anggota.jabatan,
        hadir,
        izin,
        alpha,
        persentase,
      };
    });

    // Hitung rata-rata kehadiran keseluruhan
    let totalPersentase = 0;
    rekap.forEach((r) => totalPersentase += r.persentase);
    const rataRataKehadiran = rekap.length > 0 ? Math.round(totalPersentase / rekap.length) : 0;

    // Hitung anggota teraktif (yang kehadirannya 100%)
    const anggotaTeraktifCount = rekap.filter((r) => r.persentase === 100).length;

    return {
      success: true,
      data: {
        totalPertemuan,
        rataRataKehadiran,
        anggotaTeraktifCount,
        rekap,
        bulanInfo: startOfMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
      }
    };

  } catch (error: any) {
    console.error("Error getLaporanBulanIni:", error);
    return { success: false, error: error.message };
  }
}
