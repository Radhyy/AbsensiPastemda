'use client';

import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, AlertCircle, Edit2, Users, FileCheck2 } from 'lucide-react';
import { simpanAbsensi, mulaiAbsensi } from '@/app/actions/absensi';

type Anggota = {
  id: string;
  nama: string;
  kelas: string;
  jabatan: string;
};

type Kehadiran = {
  anggotaId: string;
  status: string;
};

export default function AbsensiClient({
  tanggal,
  sesi,
  anggotaList,
  pertemuan
}: {
  tanggal: string;
  sesi: string;
  anggotaList: Anggota[];
  pertemuan: any; // null if not exists
}) {
  const [loading, setLoading] = useState(false);
  const [kehadiranState, setKehadiranState] = useState<Kehadiran[]>([]);
  const [isClientSession, setIsClientSession] = useState(sesi);
  const [notification, setNotification] = useState<{ show: boolean, message: string, type: 'success' | 'error' } | null>(null);
  
  // State untuk menentukan apakah sedang dalam mode edit/input atau mode lihat (summary)
  const [isEditing, setIsEditing] = useState(!pertemuan);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  useEffect(() => {
    setKehadiranState(
      pertemuan 
        ? anggotaList.map(a => {
            const existing = pertemuan.kehadiran.find((k: any) => k.anggotaId === a.id);
            return existing ? existing : { anggotaId: a.id, status: 'A' };
          })
        : anggotaList.map(a => ({ anggotaId: a.id, status: 'A' }))
    );
    // Jika ganti tanggal dan pertemuan ada, kembali ke mode lihat. Jika kosong, ke mode input.
    setIsEditing(!pertemuan);
    setIsCreatingNew(false);
  }, [pertemuan, anggotaList]);

  useEffect(() => {
    if (notification && notification.show) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleStatusChange = (anggotaId: string, status: string) => {
    setKehadiranState(prev => {
      const exists = prev.find(k => k.anggotaId === anggotaId);
      if (exists) {
        return prev.map(k => k.anggotaId === anggotaId ? { ...k, status } : k);
      }
      return [...prev, { anggotaId, status }];
    });
  };

  const handleSimpan = async () => {
    setLoading(true);
    try {
      if (pertemuan) {
        await simpanAbsensi(pertemuan.id, kehadiranState);
      } else {
        const p = await mulaiAbsensi(tanggal, isClientSession);
        await simpanAbsensi(p.id, kehadiranState);
      }
      setIsEditing(false);
      setIsCreatingNew(false);
      setNotification({ show: true, message: 'Data absensi berhasil disimpan', type: 'success' });
    } catch (e: any) {
      setNotification({ show: true, message: e.message || 'Gagal menyimpan absensi', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleMulai = () => {
    setIsCreatingNew(true);
    setIsEditing(true);
  };

  if (!pertemuan && !isCreatingNew) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-24 h-24 bg-[#141414] rounded-full flex items-center justify-center mb-6 border border-[#2a2a2a] shadow-lg">
          <Calendar size={40} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Belum Ada Data Absensi</h2>
        <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
          Sistem belum mencatat data kehadiran apapun untuk tanggal <strong className="text-gray-200">{new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>. Silakan buat sesi absensi sekarang.
        </p>
        <button 
          onClick={handleMulai}
          disabled={loading}
          className="flex items-center gap-3 bg-brand-yellow text-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)] disabled:opacity-50"
        >
          <FileCheck2 size={20} />
          {loading ? 'Memproses Sistem...' : 'Mulai Absensi Hari Ini'}
        </button>

        {notification && notification.show && (
          <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
              notification.type === 'success' ? 'bg-[#0a0a0a] border-green-500/30' : 'bg-[#0a0a0a] border-red-500/30'
            }`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                notification.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
              }`}>
                {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              </div>
              <p className="text-sm font-medium text-white">{notification.message}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  const hadirCount = kehadiranState.filter(k => k.status === 'H').length;
  const izinCount = kehadiranState.filter(k => k.status === 'I').length;
  const alphaCount = kehadiranState.filter(k => k.status === 'A').length;
  const totalCount = anggotaList.length;

  return (
    <div className="pb-24">
      {!isEditing ? (
        <div className="mt-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-8 max-w-3xl mx-auto shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1f1f1f]">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                <CheckCircle2 className="text-green-500" size={28} />
                Absensi Selesai
              </h3>
              <p className="text-sm md:text-base text-gray-400 mt-2">
                Data kehadiran untuk tanggal {new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} sudah terekam di sistem.
              </p>
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-[#141414] border border-[#2a2a2a] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#1f1f1f] hover:border-brand-yellow transition-all"
            >
              <Edit2 size={16} className="text-brand-yellow" />
              Edit Data
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-6">
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-3 md:p-6 text-center">
              <span className="block text-2xl md:text-4xl font-black text-green-500 mb-1 md:mb-2">{hadirCount}</span>
              <span className="text-[10px] md:text-sm font-medium text-gray-400 uppercase tracking-wider">Hadir</span>
            </div>
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-3 md:p-6 text-center flex flex-col justify-center">
              <span className="block text-2xl md:text-4xl font-black text-brand-yellow mb-1 md:mb-2">{izinCount}</span>
              <span className="text-[10px] md:text-sm font-medium text-gray-400 uppercase tracking-wider leading-tight">Izin/Sakit</span>
            </div>
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-3 md:p-6 text-center">
              <span className="block text-2xl md:text-4xl font-black text-red-500 mb-1 md:mb-2">{alphaCount}</span>
              <span className="text-[10px] md:text-sm font-medium text-gray-400 uppercase tracking-wider">Alpha</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-300">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1f1f1f] bg-[#141414]">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-16">No</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Anggota</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Kelas / Jabatan</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Status Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f1f]">
                {anggotaList.map((anggota, index) => {
                  const status = kehadiranState.find(k => k.anggotaId === anggota.id)?.status || 'A';
                  return (
                    <tr key={anggota.id} className="hover:bg-[#141414]/50 transition-colors group">
                      <td className="py-4 px-6 text-sm text-gray-500 font-mono">
                        {(index + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1f1f1f] flex items-center justify-center text-xs font-bold text-brand-yellow border border-[#333]">
                            {anggota.nama.charAt(0)}
                          </div>
                          <span className="font-semibold text-white group-hover:text-brand-yellow transition-colors">{anggota.nama}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-[#1f1f1f] border border-[#333] rounded text-[10px] font-mono text-gray-400 whitespace-nowrap">
                            {anggota.kelas}
                          </span>
                          <span className="text-xs text-gray-500">{anggota.jabatan}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStatusChange(anggota.id, 'H')}
                            className={`w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                              status === 'H' 
                                ? 'bg-green-500/20 text-green-500 border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]' 
                                : 'bg-[#1f1f1f] text-gray-500 border border-[#333] hover:border-gray-400'
                            }`}
                          >
                            H
                          </button>
                          <button
                            onClick={() => handleStatusChange(anggota.id, 'I')}
                            className={`w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                              status === 'I' 
                                ? 'bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/50 shadow-[0_0_10px_rgba(250,204,21,0.2)]' 
                                : 'bg-[#1f1f1f] text-gray-500 border border-[#333] hover:border-gray-400'
                            }`}
                          >
                            I
                          </button>
                          <button
                            onClick={() => handleStatusChange(anggota.id, 'A')}
                            className={`w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                              status === 'A' 
                                ? 'bg-red-500/20 text-red-500 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
                                : 'bg-[#1f1f1f] text-gray-500 border border-[#333] hover:border-gray-400'
                            }`}
                          >
                            A
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:ml-[280px] bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[#1f1f1f] p-4 flex flex-col sm:flex-row gap-4 items-center justify-between px-6 md:px-12 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="text-sm text-gray-400 flex gap-4">
            <span><strong className="text-green-500">{hadirCount}</strong> Hadir</span>
            <span><strong className="text-brand-yellow">{izinCount}</strong> Izin</span>
            <span><strong className="text-red-500">{alphaCount}</strong> Alpha</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (!pertemuan) {
                  setIsCreatingNew(false);
                } else {
                  setIsEditing(false);
                  setKehadiranState(pertemuan.kehadiran);
                }
              }}
              className="px-6 py-2 rounded-xl text-sm font-bold text-gray-400 border border-[#333] hover:text-white hover:border-gray-500 transition-colors"
            >
              Batal
            </button>
            <button 
              disabled={loading}
              onClick={handleSimpan}
              className="px-6 py-2.5 rounded-xl bg-brand-yellow text-black font-bold hover:bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 size={18} />
              {loading ? 'Menyimpan...' : 'Simpan Absensi'}
            </button>
          </div>
        </div>
      )}

      {notification && notification.show && (
        <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
            notification.type === 'success' 
              ? 'bg-[#0a0a0a] border-green-500/30' 
              : 'bg-[#0a0a0a] border-red-500/30'
          }`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              notification.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
            }`}>
              {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            </div>
            <p className="text-sm font-medium text-white">{notification.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
