import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, AlertCircle, Calendar, Save, Bell } from "lucide-react";
import AbsensiClient from "@/components/AbsensiClient";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { getAtauBuatPertemuan } from "@/app/actions/absensi";
import { getSemuaAnggota } from "@/app/actions/anggota";

export default async function Absensi({
  searchParams,
}: {
  searchParams: { tanggal?: string; sesi?: string };
}) {
  // Await the searchParams if Next.js version requires it (15+), but in 14 it's fine.
  // Wait, the prompt says we're on Next 16? Let's await it to be safe, but typically in App Router it's a promise in future versions.
  // We'll treat searchParams as a promise if needed, but standard is just use it directly or await it.
  const sp = await searchParams;

  const today = new Date().toISOString().split('T')[0];
  const selectedTanggal = sp.tanggal || today;
  const selectedSesi = 'Sore'; // Hardcode karena hanya 1x sehari (Sore)

  const anggotaList = await getSemuaAnggota();
  const pertemuan = await getAtauBuatPertemuan(selectedTanggal, selectedSesi);

  // Generate 7 days for the ribbon
  const generateDateRibbon = () => {
    const dates = [];
    const baseDate = new Date(selectedTanggal);
    for (let i = -3; i <= 3; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      dates.push({
        date: d,
        str: d.toISOString().split('T')[0],
        day: d.toLocaleDateString('id-ID', { weekday: 'short' }),
        dateNum: d.getDate(),
      });
    }
    return dates;
  };
  const datesRibbon = generateDateRibbon();

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <Header title="Input Absensi" description="Pilih tanggal, sesi, dan catat kehadiran anggota" />

        <div className="p-4 md:p-8 pb-24 md:pb-8 space-y-6 max-w-5xl mx-auto w-full flex-1 flex flex-col">
          {/* Date Picker Ribbon */}
          <div className="flex items-center justify-between bg-[#141414] border border-[#2a2a2a] p-2 rounded-2xl shadow-lg">
            <button className="p-2 text-gray-500 hover:text-white transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div className="flex flex-1 justify-center gap-2 overflow-x-auto hide-scrollbar px-4">
              {datesRibbon.map((d, i) => {
                const isActive = d.str === selectedTanggal;
                return (
                  <Link 
                    key={i} 
                    href={`/absensi?tanggal=${d.str}`}
                    className={`flex flex-col items-center justify-center min-w-[70px] py-3 rounded-xl transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-brand-yellow text-black shadow-[0_0_15px_rgba(250,204,21,0.2)]' 
                        : 'hover:bg-[#1a1a1a] text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <span className={`text-xs font-medium mb-1 ${isActive ? 'text-black/70' : 'text-gray-500'}`}>{d.day}</span>
                    <span className="text-lg font-bold">{d.dateNum}</span>
                  </Link>
                );
              })}
            </div>
            <button className="p-2 text-gray-500 hover:text-white transition-colors">
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                Daftar Anggota
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {new Date(selectedTanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Table Container passed to Client Component */}
          <div className="flex-1 flex flex-col">
            <AbsensiClient 
              tanggal={selectedTanggal} 
              sesi={selectedSesi} 
              anggotaList={anggotaList} 
              pertemuan={pertemuan}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
