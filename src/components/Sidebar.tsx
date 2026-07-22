'use client';

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  FileText, 
  LogOut,
  Search,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutAlert(true);
  };

  const confirmLogout = async () => {
    await logout();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="
      fixed bottom-0 left-0 right-0 h-16 w-full flex-row items-center justify-around z-[60] bg-[#0a0a0a] border-t border-[#1f1f1f] flex
      md:relative md:w-[280px] md:h-screen md:flex-col md:justify-start md:items-stretch md:border-t-0 md:border-r transition-all duration-300
    ">
      {/* Logo Section - Hidden on Mobile */}
      <div className="hidden md:flex p-6 pb-2 items-center gap-3">
        <Image src="/LogoPastemda.png" alt="PASTEMDA Logo" width={40} height={40} className="object-contain" />
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-wide text-brand-yellow leading-tight">PASTEMDA</span>
          <span className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">Admin Panel</span>
        </div>
      </div>

      {/* Search Section - Hidden on Mobile */}
      <div className="hidden md:block px-5 py-4">
        <div className="relative flex items-center bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden focus-within:border-brand-yellow/50 transition-colors">
          <Search className="absolute left-3 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-transparent py-2.5 pl-9 pr-14 text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          <div className="absolute right-2 flex items-center gap-1 text-gray-400">
            <span className="flex items-center justify-center bg-[#1f1f1f] border border-[#333] rounded px-1.5 py-0.5 text-[10px] font-mono">
              ⌘
            </span>
            <span className="flex items-center justify-center bg-[#1f1f1f] border border-[#333] rounded px-1.5 py-0.5 text-[10px] font-mono">
              S
            </span>
          </div>
        </div>
      </div>

      <div className="hidden md:block px-6 pt-2 pb-2">
        <span className="text-[11px] font-bold text-gray-500 tracking-wider">MAIN</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-row md:flex-col md:flex-1 justify-around md:justify-start w-full px-2 md:px-4 space-y-0 md:space-y-1 md:overflow-y-auto">
        <Link 
          href="/" 
          className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-xl transition-colors group ${
            isActive("/") ? "text-white font-bold" : "text-gray-500 md:text-gray-400 hover:bg-[#141414] hover:text-white"
          }`}
        >
          <LayoutDashboard size={20} className={isActive("/") ? "text-brand-yellow" : "group-hover:text-brand-yellow transition-colors"} />
          <span className="text-[10px] md:text-sm font-medium">Dashboard</span>
        </Link>
        <Link 
          href="/absensi" 
          className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-xl transition-colors group ${
            isActive("/absensi") ? "text-white font-bold" : "text-gray-500 md:text-gray-400 hover:bg-[#141414] hover:text-white"
          }`}
        >
          <CalendarCheck size={20} className={isActive("/absensi") ? "text-brand-yellow" : "group-hover:text-brand-yellow transition-colors"} />
          <span className="text-[10px] md:text-sm font-medium">Absensi</span>
        </Link>
        <Link 
          href="/anggota" 
          className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-xl transition-colors group ${
            isActive("/anggota") ? "text-white font-bold" : "text-gray-500 md:text-gray-400 hover:bg-[#141414] hover:text-white"
          }`}
        >
          <Users size={20} className={isActive("/anggota") ? "text-brand-yellow" : "group-hover:text-brand-yellow transition-colors"} />
          <span className="text-[10px] md:text-sm font-medium">Anggota</span>
        </Link>
        <Link 
          href="/laporan" 
          className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-xl transition-colors group ${
            isActive("/laporan") ? "text-white font-bold" : "text-gray-500 md:text-gray-400 hover:bg-[#141414] hover:text-white"
          }`}
        >
          <FileText size={20} className={isActive("/laporan") ? "text-brand-yellow" : "group-hover:text-brand-yellow transition-colors"} />
          <span className="text-[10px] md:text-sm font-medium">Laporan</span>
        </Link>
      </nav>

      {/* User Profile & Logout - Hidden on Mobile */}
      <div className="hidden md:block p-4">
        <button 
          onClick={handleLogoutClick}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-500/10 font-medium transition-colors mb-4"
        >
          <LogOut size={18} />
          <span className="text-sm">Keluar</span>
        </button>
        
        <div className="flex items-center gap-3 p-3 bg-[#141414] border border-[#2a2a2a] rounded-xl">
          <div className="flex-shrink-0 drop-shadow-[0_0_8px_rgba(250,204,21,0.25)]">
            <Image src="/LogoPastemda.png" alt="Profile" width={40} height={40} className="object-contain" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-semibold text-white truncate">Komandan</span>
            <span className="text-xs text-brand-yellow truncate">Admin Utama</span>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-2 text-center">Konfirmasi Keluar</h3>
            <p className="text-sm text-gray-400 text-center mb-6">
              Apakah Anda yakin ingin keluar dari Admin Panel PASTEMDA?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutAlert(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#333] text-gray-300 font-medium hover:bg-[#1a1a1a] transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-500/10 text-red-500 font-bold border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
