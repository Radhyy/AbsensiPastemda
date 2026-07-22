import Image from "next/image";
import Link from "next/link";
import { 
  Users, 
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { getDashboardStats } from "./actions/dashboard";

export default async function Dashboard() {
  const result = await getDashboardStats();
  const data = result.data;

  // Nilai default jika data gagal dimuat (meski seharusnya tidak)
  const totalAnggota = data?.totalAnggota || 0;
  const hadirHariIni = data?.hariIni.hadir || 0;
  const izinSakitHariIni = data?.hariIni.izinSakit || 0;
  const alpaHariIni = data?.hariIni.alpa || 0;
  
  const persentaseBulanIni = data?.persentaseBulanIni || 0;
  const pKelas = data?.persentaseKelas || { X: 0, XI: 0, XII: 0 };
  
  const kehadiranRendah = data?.kehadiranRendah || [];
  const absensiTerbaru = data?.absensiTerbaru || [];

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <Header title="Dashboard" description="Ringkasan absensi PASTEMDA hari ini" />

        {/* Content Body */}
        <div className="p-4 md:p-8 pb-24 md:pb-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Stat Card 1 */}
            <div className="bg-gradient-to-br from-[#141414] to-[#0d0d0d] p-4 md:p-6 rounded-2xl border border-[#2a2a2a] relative overflow-hidden group hover:border-brand-yellow/50 transition-all hover:shadow-[0_0_20px_rgba(250,204,21,0.1)] hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users size={60} className="md:w-20 md:h-20" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <Users size={24} />
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Total Anggota</h3>
                <p className="text-3xl font-bold mt-1">{totalAnggota}</p>
                <div className="mt-4 text-xs text-blue-400 bg-blue-500/10 inline-block px-2 py-1 rounded-md">
                  Pasukan Aktif
                </div>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-gradient-to-br from-[#141414] to-[#0d0d0d] p-4 md:p-6 rounded-2xl border border-[#2a2a2a] relative overflow-hidden group hover:border-green-500/50 transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <CheckCircle2 size={60} className="md:w-20 md:h-20" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Hadir Hari Ini</h3>
                <p className="text-3xl font-bold mt-1">{hadirHariIni}</p>
                <div className="mt-4 text-xs text-green-400 bg-green-500/10 inline-block px-2 py-1 rounded-md">
                  Formasi Lengkap
                </div>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-gradient-to-br from-[#141414] to-[#0d0d0d] p-4 md:p-6 rounded-2xl border border-[#2a2a2a] relative overflow-hidden group hover:border-brand-yellow/50 transition-all hover:shadow-[0_0_20px_rgba(250,204,21,0.1)] hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <AlertCircle size={60} className="md:w-20 md:h-20" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-brand-yellow/10 text-brand-yellow rounded-xl flex items-center justify-center mb-4">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Izin / Sakit</h3>
                <p className="text-3xl font-bold mt-1">{izinSakitHariIni}</p>
                <div className="mt-4 text-xs text-brand-yellow bg-brand-yellow/10 inline-block px-2 py-1 rounded-md">
                  Perlu Konfirmasi
                </div>
              </div>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-gradient-to-br from-[#141414] to-[#0d0d0d] p-4 md:p-6 rounded-2xl border border-[#2a2a2a] relative overflow-hidden group hover:border-red-500/50 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <XCircle size={60} className="md:w-20 md:h-20" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mb-4">
                  <XCircle size={24} />
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Alpa</h3>
                <p className="text-3xl font-bold mt-1">{alpaHariIni}</p>
                <div className="mt-4 text-xs text-red-400 bg-red-500/10 inline-block px-2 py-1 rounded-md">
                  Perlu ditindaklanjuti
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Alerts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Donut Chart (Kehadiran Keseluruhan) */}
            <div className="bg-[#141414] border border-[#2a2a2a] p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center group hover:border-brand-yellow/30 transition-colors">
              <h3 className="text-gray-400 text-sm font-medium w-full mb-6">Persentase Kehadiran Bulan Ini</h3>
              <div className="relative w-40 h-40 rounded-full flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(250,204,21,0.15)] group-hover:shadow-[0_0_25px_rgba(250,204,21,0.25)] transition-shadow" style={{ background: `conic-gradient(#facc15 0% ${persentaseBulanIni}%, #2a2a2a ${persentaseBulanIni}% 100%)` }}>
                <div className="w-32 h-32 bg-[#141414] rounded-full flex flex-col items-center justify-center shadow-inner">
                  <span className="text-4xl font-bold text-white">{persentaseBulanIni}%</span>
                  <span className="text-xs text-brand-yellow tracking-widest uppercase mt-1">Hadir</span>
                </div>
              </div>
              <div className="flex gap-6 mt-6 w-full justify-center">
                <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
                  <span className="w-3 h-3 rounded-full bg-brand-yellow shadow-[0_0_8px_rgba(250,204,21,0.6)]"></span> Hadir
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <span className="w-3 h-3 rounded-full bg-[#2a2a2a]"></span> Absen
                </div>
              </div>
            </div>

            {/* Bar Charts (Kehadiran per Kelas) */}
            <div className="bg-[#141414] border border-[#2a2a2a] p-6 rounded-2xl shadow-lg flex flex-col">
              <h3 className="text-gray-400 text-sm font-medium mb-8">Tingkat Kehadiran Per Kelas</h3>
              <div className="space-y-6 flex-1 justify-center flex flex-col px-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-white">Kelas X</span>
                    <span className="text-brand-yellow">{pKelas.X}%</span>
                  </div>
                  <div className="w-full bg-[#2a2a2a] rounded-full h-2.5 overflow-hidden">
                    <div className="bg-brand-yellow h-full rounded-full relative" style={{ width: `${pKelas.X}%` }}>
                      <div className="absolute inset-0 bg-white/20 w-full h-full"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-white">Kelas XI</span>
                    <span className="text-green-500">{pKelas.XI}%</span>
                  </div>
                  <div className="w-full bg-[#2a2a2a] rounded-full h-2.5 overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: `${pKelas.XI}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Members with Low Attendance Alert */}
            <div className="bg-gradient-to-br from-[#1a0f0f] to-[#141414] border border-red-500/20 p-6 rounded-2xl shadow-lg flex flex-col relative overflow-hidden">
              <div className="absolute -top-10 -right-10 text-red-500/5">
                <AlertCircle size={150} />
              </div>
              <div className="flex items-center gap-2 mb-2 text-red-500 relative z-10">
                <AlertCircle size={22} className="animate-pulse" />
                <h3 className="font-bold text-lg">Kehadiran Rendah</h3>
              </div>
              <p className="text-xs text-red-400/80 mb-5 relative z-10">Anggota dengan kehadiran terendah bulan ini.</p>
              
              <div className="space-y-3 overflow-y-auto flex-1 relative z-10">
                {kehadiranRendah.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center mt-8">Belum ada data kehadiran rendah.</div>
                ) : (
                  kehadiranRendah.map((member: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#0a0a0a]/80 rounded-xl border border-red-500/10 hover:border-red-500/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-sm font-bold border border-red-500/20">
                          {member.nama.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white truncate max-w-[120px]">{member.nama}</span>
                          <span className="text-[11px] text-gray-500 truncate max-w-[120px]">{member.kelas}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-red-500 bg-red-500/10 px-2.5 py-1 rounded-md">{member.persentase}%</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-lg">
            <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-6 bg-brand-yellow rounded-full"></span>
                Tindak Lanjut Hari Ini (Alpa/Izin/Sakit)
              </h2>
              <Link href="/laporan" className="text-sm font-medium text-brand-yellow hover:text-white transition-colors">Lihat Laporan</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="bg-[#0a0a0a] text-gray-400 text-sm">
                    <th className="py-4 px-6 font-medium">Nama Anggota</th>
                    <th className="py-4 px-6 font-medium">Kelas / Jabatan</th>
                    <th className="py-4 px-6 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]">
                  {absensiTerbaru.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-gray-500 text-sm">Belum ada absen bermasalah hari ini.</td>
                    </tr>
                  ) : (
                    absensiTerbaru.map((row: any, index: number) => {
                      let color = 'text-green-400 bg-green-500/10 border-green-500/20';
                      if (row.statusLabel === 'Alpa') color = 'text-red-400 bg-red-500/10 border-red-500/20';
                      else if (row.statusLabel === 'Izin' || row.statusLabel === 'Sakit') color = 'text-brand-yellow bg-brand-yellow/10 border-brand-yellow/20';

                      return (
                        <tr key={index} className="hover:bg-[#1a1a1a] transition-colors group">
                          <td className="py-4 px-6 font-medium text-white flex items-center gap-4">
                            <div className="w-9 h-9 rounded-full bg-[#2a2a2a] flex items-center justify-center text-sm font-bold text-brand-yellow group-hover:bg-brand-yellow group-hover:text-black transition-colors shadow-inner">
                              {row.anggota.nama.charAt(0)}
                            </div>
                            {row.anggota.nama}
                          </td>
                          <td className="py-4 px-6 text-gray-400 text-sm">
                            <span className="inline-block bg-[#1f1f1f] border border-[#333] px-2 py-0.5 rounded text-[11px] font-mono mr-2">
                              {row.anggota.kelas}
                            </span>
                            {row.anggota.jabatan}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${color}`}>
                              {row.statusLabel}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
