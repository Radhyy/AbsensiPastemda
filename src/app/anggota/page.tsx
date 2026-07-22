import Image from "next/image";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Bell,
  Search,
  Plus,
  Filter,
} from "lucide-react";
import TambahAnggotaModal from "@/components/TambahAnggotaModal";
import AnggotaActions from "@/components/AnggotaActions";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { getSemuaAnggota } from "@/app/actions/anggota";

export default async function DataAnggota() {
  const anggotaList = await getSemuaAnggota();

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative bg-[#050505]">
        <Header title="Data Anggota" description="Manajemen informasi dan daftar anggota pengibaran" />

        <div className="p-4 md:p-8 pb-24 md:pb-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative group flex-1 sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-yellow transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari nama anggota..." 
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow/50 transition-all"
                />
              </div>
              <button className="flex items-center gap-2 bg-[#141414] border border-[#2a2a2a] px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:border-brand-yellow/50 transition-all">
                <Filter size={16} />
                Filter
              </button>
            </div>
            
            <TambahAnggotaModal />
          </div>

          {/* Members Table */}
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="bg-[#0a0a0a] text-gray-400 text-sm border-b border-[#2a2a2a]">
                    <th className="py-4 px-6 font-medium w-16">No</th>
                    <th className="py-4 px-6 font-medium">Profil Anggota</th>
                    <th className="py-4 px-6 font-medium">Kelas / Jabatan</th>
                    <th className="py-4 px-6 font-medium">Status</th>
                    <th className="py-4 px-6 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]">
                  {anggotaList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        Belum ada data anggota. Silakan tambah anggota baru.
                      </td>
                    </tr>
                  ) : (
                    anggotaList.map((row, index) => (
                      <tr key={row.id} className="hover:bg-[#1a1a1a] transition-colors group">
                        <td className="py-4 px-6 text-gray-500 text-sm font-mono">{String(index + 1).padStart(2, '0')}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2a2a2a] to-[#1f1f1f] flex items-center justify-center text-sm font-bold text-gray-300 border border-[#333] group-hover:border-brand-yellow/50 group-hover:text-brand-yellow transition-colors">
                              {row.nama.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-white">{row.nama}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-400 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="inline-block bg-[#1f1f1f] border border-[#333] px-2 py-0.5 rounded text-[11px] font-mono">
                              {row.kelas}
                            </span>
                            <span className="text-gray-300">{row.jabatan}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                            row.status === 'Aktif' 
                              ? 'bg-green-500/10 text-green-500 border-green-500/20'
                              : row.status === 'Cuti'
                              ? 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20'
                              : 'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <AnggotaActions anggota={row} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-[#2a2a2a] flex items-center justify-between bg-[#0a0a0a]">
              <span className="text-sm text-gray-500">
                Menampilkan <strong className="text-white">{anggotaList.length}</strong> anggota terdaftar
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
