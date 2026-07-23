'use client';

import { Search, Bell } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface HeaderProps {
  title: string;
  description: string;
}

export default function Header({ title, description }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/anggota?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-20 flex-shrink-0 flex items-center justify-between px-4 md:px-8 bg-[#0a0a0a] sticky top-0 z-50 border-b border-[#1f1f1f] shadow-sm">
      <div className="flex-1 min-w-0 pr-2 md:pr-4">
        <h1 className="text-xl md:text-2xl font-bold text-white truncate">{title}</h1>
        <p className="text-xs md:text-sm text-gray-400 truncate">{description}</p>
      </div>

      <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
        <form onSubmit={handleSearch} className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-yellow transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Cari anggota..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#141414] border border-[#2a2a2a] rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow/50 transition-all w-64"
          />
        </form>
        <button className="relative p-2 text-gray-400 hover:text-brand-yellow transition-colors">
          <Bell size={22} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-brand-yellow rounded-full border-2 border-[#0a0a0a]"></span>
        </button>
        <div className="flex items-center gap-3 md:pl-6 md:border-l border-[#2a2a2a]">
          <div className="flex-shrink-0 drop-shadow-[0_0_8px_rgba(250,204,21,0.25)]">
            <Image src="/LogoPastemda.png" alt="Admin" width={40} height={40} className="object-contain" />
          </div>
          <div className="hidden lg:block text-white">
            <p className="text-sm font-medium">Komandan</p>
            <p className="text-xs text-brand-yellow">Admin Utama</p>
          </div>
        </div>
      </div>
    </header>
  );
}
