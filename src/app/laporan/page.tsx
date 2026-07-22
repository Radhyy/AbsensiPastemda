import Sidebar from "@/components/Sidebar";
import { getLaporanBulanIni } from "@/app/actions/laporan";
import LaporanClient from "@/components/LaporanClient";
import Header from "@/components/Header";
import { Bell } from "lucide-react";

export default async function Laporan() {
  const response = await getLaporanBulanIni();
  
  if (!response.success || !response.data) {
    return (
      <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full overflow-y-auto relative bg-[#050505] p-8">
           <h1 className="text-2xl font-bold text-red-500">Gagal memuat data laporan</h1>
           <p>{response.error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative bg-[#050505]">
        <Header title="Laporan Kehadiran" description="Rekapitulasi dan ekspor data absensi anggota" />

        <LaporanClient laporan={response.data} />
      </main>
    </div>
  );
}
