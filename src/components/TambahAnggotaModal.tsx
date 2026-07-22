'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { tambahAnggota } from '@/app/actions/anggota';

export default function TambahAnggotaModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await tambahAnggota(formData);
    
    if (result.success) {
      setIsOpen(false);
      // Reset form handled by HTML
    } else {
      alert('Gagal menambahkan anggota: ' + result.error);
    }
    
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-brand-yellow text-black px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)] hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all w-full sm:w-auto justify-center"
      >
        <Plus size={18} />
        Tambah Anggota
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a0a] border border-[#2a2a2a] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#1f1f1f] flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Tambah Anggota Baru</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-500 hover:text-white bg-[#141414] rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-400">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="nama"
                  required
                  placeholder="Contoh: Budi Santoso"
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">Kelas</label>
                  <select 
                    name="kelas"
                    required
                    className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors appearance-none"
                  >
                    <option value="" disabled selected>Pilih Kelas</option>
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
                    className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors appearance-none"
                  >
                    <option value="Pastemda">Pastemda</option>
                    <option value="Pasukan">Pasukan</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-[#333] text-gray-300 font-medium hover:bg-[#141414] transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-brand-yellow text-black font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
