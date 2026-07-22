'use client';

import { useState } from 'react';
import { Calendar, Users, FileSpreadsheet, CalendarCheck, BarChart3, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import ExcelJS from 'exceljs';

type RekapAnggota = {
  id: string;
  nama: string;
  kelas: string;
  jabatan: string;
  hadir: number;
  izin: number;
  alpha: number;
  persentase: number;
};

type LaporanData = {
  totalPertemuan: number;
  rataRataKehadiran: number;
  anggotaTeraktifCount: number;
  rekap: RekapAnggota[];
  bulanInfo: string;
};

export default function LaporanClient({ laporan }: { laporan: LaporanData }) {
  const [data, setData] = useState<LaporanData>(laporan);
  const [sortKey, setSortKey] = useState<keyof RekapAnggota>('persentase');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterKelas, setFilterKelas] = useState('Semua Kelas');

  const handleSort = (key: keyof RekapAnggota) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder(key === 'nama' || key === 'kelas' ? 'asc' : 'desc');
    }
  };

  const getSortIcon = (key: keyof RekapAnggota) => {
    if (sortKey !== key) return null;
    return sortOrder === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />;
  };

  // Filter based on Kelas
  const filteredRekap = data.rekap.filter(r => {
    if (filterKelas === 'Semua Kelas') return true;
    if (filterKelas === 'Kelas X') return r.kelas.startsWith('X') && !r.kelas.startsWith('XI');
    if (filterKelas === 'Kelas XI') return r.kelas.startsWith('XI');
    return true;
  });

  // Sort the filtered data
  const sortedRekap = [...filteredRekap].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Calculate dynamic stats based on filtered data
  let totalPersentase = 0;
  sortedRekap.forEach(r => totalPersentase += r.persentase);
  const filteredRataRata = sortedRekap.length > 0 ? Math.round(totalPersentase / sortedRekap.length) : 0;
  const filteredTeraktif = sortedRekap.filter(r => r.persentase === 100).length;
  const filteredTeraktifPercentage = sortedRekap.length > 0 ? Math.round((filteredTeraktif / sortedRekap.length) * 100) : 0;

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Absensi");

    // Definisikan Kolom dan Lebarnya
    worksheet.columns = [
      { header: 'No', key: 'no', width: 6 },
      { header: 'Nama Anggota', key: 'nama', width: 35 },
      { header: 'Kelas', key: 'kelas', width: 15 },
      { header: 'Jabatan', key: 'jabatan', width: 20 },
      { header: 'Hadir', key: 'hadir', width: 10 },
      { header: 'Izin/Sakit', key: 'izin', width: 15 },
      { header: 'Alpha', key: 'alpha', width: 10 },
      { header: 'Persentase (%)', key: 'persentase', width: 18 }
    ];

    // Styling Header (Baris Pertama)
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // Tulisan Putih
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0a0a0a' } // Background Hitam (mirip UI website)
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'medium', color: { argb: 'FFFACC15' } }, // Garis bawah kuning (Brand Yellow)
        right: { style: 'thin' }
      };
    });

    // Tambahkan Data beserta style baris
    sortedRekap.forEach((row, index) => {
      const addedRow = worksheet.addRow({
        no: index + 1,
        nama: row.nama,
        kelas: row.kelas,
        jabatan: row.jabatan,
        hadir: row.hadir,
        izin: row.izin,
        alpha: row.alpha,
        persentase: row.persentase
      });

      // Style untuk setiap sel di baris data (Border)
      addedRow.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
          left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
          bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
          right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
        };
        cell.alignment = { vertical: 'middle' };
        
        // Posisikan angka ke tengah
        if ([1, 5, 6, 7, 8].includes(colNumber)) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      });
    });

    // Proses Download File
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    const safeBulanInfo = data.bulanInfo.replace(/ /g, '_');
    a.download = `Laporan_Absensi_${safeBulanInfo}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Actions & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#141414] border border-[#2a2a2a] p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-2 opacity-50 cursor-not-allowed" title="Pemilihan bulan akan tersedia di versi berikutnya">
            <Calendar size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-500">{data.bulanInfo}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-2 focus-within:border-brand-yellow/50 transition-colors">
            <Users size={18} className="text-brand-yellow" />
            <select 
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer appearance-none outline-none"
            >
              <option className="bg-[#141414]" value="Semua Kelas">Semua Kelas</option>
              <option className="bg-[#141414]" value="Kelas X">Kelas X</option>
              <option className="bg-[#141414]" value="Kelas XI">Kelas XI</option>
            </select>
          </div>
        </div>
        
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 shadow-md transition-all w-full sm:w-auto justify-center group"
        >
          <FileSpreadsheet size={18} className="group-hover:text-green-600 transition-colors" />
          Export ke Excel
        </button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-br from-[#141414] to-[#0d0d0d] p-6 rounded-2xl border border-[#2a2a2a] relative overflow-hidden group hover:border-brand-yellow/30 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <CalendarCheck size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Total Latihan (Bulan Ini)</p>
              <p className="text-2xl font-bold text-white mt-1">{data.totalPertemuan} <span className="text-sm font-normal text-gray-500">Pertemuan</span></p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#141414] to-[#0d0d0d] p-6 rounded-2xl border border-[#2a2a2a] relative overflow-hidden group hover:border-brand-yellow/30 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-yellow/10 text-brand-yellow flex items-center justify-center">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Rata-rata Kehadiran</p>
              <p className="text-2xl font-bold text-white mt-1">{filteredRataRata}%</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#141414] to-[#0d0d0d] p-6 rounded-2xl border border-[#2a2a2a] relative overflow-hidden group hover:border-brand-yellow/30 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Anggota Teraktif (100%)</p>
              <p className="text-2xl font-bold text-white mt-1">{filteredTeraktif} <span className="text-sm font-normal text-gray-500">Orang ({filteredTeraktifPercentage}%)</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Rekapitulasi Table */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-lg animate-in fade-in duration-700">
        <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-6 bg-brand-yellow rounded-full"></span>
            Rekapitulasi Bulan {data.bulanInfo.split(' ')[0]}
          </h2>
          <span className="text-sm text-gray-500">Klik header tabel untuk menyortir data</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-[#0a0a0a] text-gray-400 text-sm border-b border-[#2a2a2a] select-none">
                <th className="py-4 px-6 font-medium w-16">No</th>
                <th 
                  className="py-4 px-6 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('nama')}
                >
                  Nama Anggota {getSortIcon('nama')}
                </th>
                <th 
                  className="py-4 px-6 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('kelas')}
                >
                  Kelas / Jabatan {getSortIcon('kelas')}
                </th>
                <th 
                  className="py-4 px-6 font-medium text-center cursor-pointer hover:text-green-500 transition-colors group"
                  onClick={() => handleSort('hadir')}
                >
                  <span className="group-hover:text-green-500 text-green-500/80">Hadir {getSortIcon('hadir')}</span>
                </th>
                <th 
                  className="py-4 px-6 font-medium text-center cursor-pointer hover:text-brand-yellow transition-colors group"
                  onClick={() => handleSort('izin')}
                >
                  <span className="group-hover:text-brand-yellow text-brand-yellow/80">Izin/Sakit {getSortIcon('izin')}</span>
                </th>
                <th 
                  className="py-4 px-6 font-medium text-center cursor-pointer hover:text-red-500 transition-colors group"
                  onClick={() => handleSort('alpha')}
                >
                  <span className="group-hover:text-red-500 text-red-500/80">Alpha {getSortIcon('alpha')}</span>
                </th>
                <th 
                  className="py-4 px-6 font-medium text-right cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('persentase')}
                >
                  Persentase {getSortIcon('persentase')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {sortedRekap.map((row, index) => (
                <tr key={row.id} className="hover:bg-[#1a1a1a] transition-colors group">
                  <td className="py-4 px-6 text-gray-500 text-sm font-mono">{String(index + 1).padStart(2, '0')}</td>
                  <td className="py-4 px-6 font-medium text-white flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#2a2a2a] flex items-center justify-center text-sm font-bold text-gray-400 border border-[#333]">
                      {row.nama.charAt(0)}
                    </div>
                    {row.nama}
                  </td>
                  <td className="py-4 px-6 text-gray-400 text-sm">
                    <span className="inline-block bg-[#1f1f1f] border border-[#333] px-2 py-0.5 rounded text-[11px] font-mono mr-2">
                      {row.kelas}
                    </span>
                    {row.jabatan}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex w-8 h-8 items-center justify-center bg-green-500/10 text-green-500 rounded-lg font-bold shadow-sm">
                        {row.hadir}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex w-8 h-8 items-center justify-center bg-brand-yellow/10 text-brand-yellow rounded-lg font-bold shadow-sm">
                        {row.izin}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex w-8 h-8 items-center justify-center rounded-lg font-bold shadow-sm ${row.alpha > 0 ? 'bg-red-500/20 text-red-500' : 'bg-red-500/5 text-red-500/50'}`}>
                        {row.alpha}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex flex-col items-end gap-1.5">
                        <span className={`text-sm font-bold ${row.persentase < 50 ? 'text-red-500' : 'text-white'}`}>{row.persentase}%</span>
                        <div className="w-24 h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                          <div 
                              className={`h-full rounded-full transition-all duration-1000 ${row.persentase < 50 ? 'bg-red-500' : row.persentase < 80 ? 'bg-brand-yellow' : 'bg-green-500'}`} 
                              style={{ width: `${row.persentase}%` }}
                          ></div>
                        </div>
                    </div>
                  </td>
                </tr>
              ))}
              {sortedRekap.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 font-medium">
                    Tidak ada data anggota ditemukan untuk filter yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-[#2a2a2a] flex items-center justify-between bg-[#0a0a0a]">
          <span className="text-sm text-gray-500">
            Menampilkan <strong className="text-white">{sortedRekap.length}</strong> anggota dari total <strong className="text-white">{data.rekap.length}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
