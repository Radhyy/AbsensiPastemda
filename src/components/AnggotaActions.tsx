'use client';

import { useState } from 'react';
import { Edit2, Trash2, MoreVertical, X, AlertTriangle } from 'lucide-react';
import { hapusAnggota, editAnggota } from '@/app/actions/anggota';

export default function AnggotaActions({ anggota }: { anggota: any }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await hapusAnggota(anggota.id);
    if (result.success) {
      setIsDeleteOpen(false);
    } else {
      alert('Gagal menghapus: ' + result.error);
    }
    setLoading(false);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await editAnggota(anggota.id, formData);
    
    if (result.success) {
      setIsEditOpen(false);
    } else {
      alert('Gagal mengedit: ' + result.error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <button 
          onClick={() => setIsEditOpen(true)}
          className="p-2 bg-[#1f1f1f] text-gray-400 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors border border-[#333] hover:border-blue-500/50" 
          title="Edit"
        >
          <Edit2 size={14} />
        </button>
        <button 
          onClick={() => setIsDeleteOpen(true)}
          className="p-2 bg-[#1f1f1f] text-gray-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors border border-[#333] hover:border-red-500/50" 
          title="Hapus"
        >
          <Trash2 size={14} />
        </button>
        <button className="p-2 text-gray-500 hover:text-white transition-colors ml-1">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
          <div className="bg-[#0a0a0a] border border-red-500/30 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Hapus Anggota?</h3>
                <p className="text-gray-400 mt-2 text-sm">
                  Apakah Anda yakin ingin menghapus <strong>{anggota.nama}</strong>? Data yang dihapus tidak dapat dikembalikan.
                </p>
              </div>
            </div>
            <div className="p-4 bg-[#141414] border-t border-[#1f1f1f] flex gap-3">
              <button 
                onClick={() => setIsDeleteOpen(false)}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl border border-[#333] text-gray-300 font-medium hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
          <div className="bg-[#0a0a0a] border border-[#2a2a2a] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#1f1f1f] flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Edit Anggota</h2>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="p-2 text-gray-500 hover:text-white bg-[#141414] rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-400">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="nama"
                  defaultValue={anggota.nama}
                  required
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">Kelas</label>
                  <select 
                    name="kelas"
                    required
                    defaultValue={anggota.kelas}
                    className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors appearance-none"
                  >
                    <option value="" disabled>Pilih Kelas</option>
                    <option value="X SIJA 1">X SIJA 1</option>
                    <option value="X SIJA 2">X SIJA 2</option>
                    <option value="X TJAT 1">X TJAT 1</option>
                    <option value="X TJAT 2">X TJAT 2</option>
                    <option value="X TJAT 3">X TJAT 3</option>
                    <option value="X TJAT 4">X TJAT 4</option>
                    <option value="X TJAT 5">X TJAT 5</option>
                    <option value="X TJAT 6">X TJAT 6</option>
                    <option value="XI SIJA 1">XI SIJA 1</option>
                    <option value="XI SIJA 2">XI SIJA 2</option>
                    <option value="XI TJAT 1">XI TJAT 1</option>
                    <option value="XI TJAT 2">XI TJAT 2</option>
                    <option value="XI TJAT 3">XI TJAT 3</option>
                    <option value="XI TJAT 4">XI TJAT 4</option>
                    <option value="XI TJAT 5">XI TJAT 5</option>
                    <option value="XI TJAT 6">XI TJAT 6</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">Jabatan</label>
                  <select 
                    name="jabatan"
                    required
                    defaultValue={anggota.jabatan}
                    className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors appearance-none"
                  >
                    <option value="Pastemda">Pastemda</option>
                    <option value="Pasukan">Pasukan</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-400">Status</label>
                <select 
                  name="status"
                  required
                  defaultValue={anggota.status}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors appearance-none"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-[#333] text-gray-300 font-medium hover:bg-[#141414] transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-brand-yellow text-black font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
