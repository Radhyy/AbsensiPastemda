'use client';

import { useState } from 'react';
import { login } from '@/app/actions/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(username, password);

    if (res.success) {
      router.push('/');
      router.refresh();
    } else {
      setError(res.error || 'Login gagal');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141414] rounded-3xl border border-[#1f1f1f] shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]">
            <Image 
              src="/LogoPastemda.png" 
              alt="Logo Pastemda" 
              width={90} 
              height={90} 
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">PASTEMDA</h1>
          <p className="text-sm font-semibold text-brand-yellow tracking-widest uppercase mt-1">Admin Panel</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-yellow transition-colors"
              placeholder="Masukkan username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-yellow transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-yellow text-black font-bold py-3.5 rounded-xl hover:bg-yellow-400 active:scale-95 transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)] disabled:opacity-50 mt-4"
          >
            {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
          </button>
        </form>
      </div>
      
      <p className="text-gray-600 text-xs mt-8">
        © 2026 PASTEMDA. All rights reserved.
      </p>
    </div>
  );
}
