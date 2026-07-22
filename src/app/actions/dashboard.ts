'use server';

import { prisma } from '@/lib/prisma';

export async function getDashboardStats() {
  try {
    const today = new Date();
    // Use local date string YYYY-MM-DD
    const todayStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    const todayDate = new Date(todayStr);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // 1. Total Anggota
    const totalAnggota = await prisma.anggota.count({
      where: { status: 'Aktif' }
    });

    // 2. Hari ini (Sore)
    let hadirHariIni = 0;
    let izinSakitHariIni = 0;
    let alpaHariIni = 0;
    let absensiTerbaru: any[] = [];

    const pertemuanHariIni = await prisma.pertemuan.findFirst({
      where: { 
        tanggal: todayDate,
        sesi: 'Sore' // assuming 'Sore' is the primary
      },
      include: {
        kehadiran: {
          include: { anggota: true }
        }
      }
    });

    if (pertemuanHariIni) {
      pertemuanHariIni.kehadiran.forEach(k => {
        if (k.status === 'H') hadirHariIni++;
        else if (k.status === 'I' || k.status === 'S') {
          izinSakitHariIni++;
          absensiTerbaru.push({ ...k, statusLabel: k.status === 'I' ? 'Izin' : 'Sakit' });
        }
        else if (k.status === 'A') {
          alpaHariIni++;
          absensiTerbaru.push({ ...k, statusLabel: 'Alpa' });
        }
      });
    }

    // 3. Persentase Bulan Ini & Per Kelas & Kehadiran Rendah
    const pertemuanBulanIni = await prisma.pertemuan.findMany({
      where: {
        tanggal: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        }
      },
      include: {
        kehadiran: {
          include: { anggota: true }
        }
      }
    });

    let totalHadirBulanIni = 0;
    let totalKehadiranRecordBulanIni = 0;
    
    // Untuk perhitungan per kelas & anggota
    const rekapAnggota = new Map<string, { nama: string, kelas: string, hadir: number, total: number }>();
    const rekapKelas = new Map<string, { hadir: number, total: number }>();
    
    // Inisialisasi rekap kelas (X, XI, XII)
    rekapKelas.set('X', { hadir: 0, total: 0 });
    rekapKelas.set('XI', { hadir: 0, total: 0 });
    rekapKelas.set('XII', { hadir: 0, total: 0 });

    pertemuanBulanIni.forEach(p => {
      p.kehadiran.forEach(k => {
        totalKehadiranRecordBulanIni++;
        if (k.status === 'H') totalHadirBulanIni++;

        // Hitung rekap anggota individu
        if (!rekapAnggota.has(k.anggota.id)) {
          rekapAnggota.set(k.anggota.id, {
            nama: k.anggota.nama,
            kelas: k.anggota.kelas,
            hadir: 0,
            total: 0
          });
        }
        const a = rekapAnggota.get(k.anggota.id)!;
        a.total++;
        if (k.status === 'H') a.hadir++;

        // Hitung rekap kelas (Regex untuk mengambil 'X', 'XI', 'XII' dari awal string kelas)
        let kelasGroup = 'X';
        if (k.anggota.kelas.startsWith('XII')) kelasGroup = 'XII';
        else if (k.anggota.kelas.startsWith('XI')) kelasGroup = 'XI';
        else if (k.anggota.kelas.startsWith('X')) kelasGroup = 'X';
        
        const kls = rekapKelas.get(kelasGroup);
        if (kls) {
           kls.total++;
           if (k.status === 'H') kls.hadir++;
        }
      });
    });

    const persentaseBulanIni = totalKehadiranRecordBulanIni > 0 
      ? Math.round((totalHadirBulanIni / totalKehadiranRecordBulanIni) * 100) 
      : 0;

    const persentaseKelas = {
      X: rekapKelas.get('X')!.total > 0 ? Math.round((rekapKelas.get('X')!.hadir / rekapKelas.get('X')!.total) * 100) : 0,
      XI: rekapKelas.get('XI')!.total > 0 ? Math.round((rekapKelas.get('XI')!.hadir / rekapKelas.get('XI')!.total) * 100) : 0,
      XII: rekapKelas.get('XII')!.total > 0 ? Math.round((rekapKelas.get('XII')!.hadir / rekapKelas.get('XII')!.total) * 100) : 0,
    };

    // Cari anggota dengan persentase terendah (bottom 3, hanya jika persentase < 50%)
    let kehadiranRendah: any[] = [];
    rekapAnggota.forEach((val, id) => {
      const p = val.total > 0 ? Math.round((val.hadir / val.total) * 100) : 0;
      kehadiranRendah.push({ id, nama: val.nama, kelas: val.kelas, persentase: p });
    });
    kehadiranRendah.sort((a, b) => a.persentase - b.persentase);
    kehadiranRendah = kehadiranRendah.filter(k => k.persentase < 100).slice(0, 3); // Ambil 3 terendah yang tidak sempurna

    return {
      success: true,
      data: {
        totalAnggota,
        hariIni: {
          hadir: hadirHariIni,
          izinSakit: izinSakitHariIni,
          alpa: alpaHariIni
        },
        persentaseBulanIni,
        persentaseKelas,
        kehadiranRendah,
        absensiTerbaru: absensiTerbaru.slice(0, 5) // ambil 5 terbaru
      }
    };
  } catch (error: any) {
    console.error("Dashboard error:", error);
    return { success: false, error: error.message };
  }
}
