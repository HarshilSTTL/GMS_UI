'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function NotFound() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      // Clear all session data
      localStorage.removeItem('gms-auth');
      localStorage.removeItem('authToken');
      sessionStorage.clear();
      document.cookie.split(";").forEach(c => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });

      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F2F7] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-[20px] border border-[#DDE3EE] shadow-[0_4px_24px_rgba(14,28,47,0.10)] p-10">
          {/* 404 number */}
          <div className="text-[72px] font-bold leading-none mb-2" style={{ color: '#DDE3EE' }}>404</div>

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1A56C4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="11" /><line x1="11" y1="14" x2="11.01" y2="14" />
            </svg>
          </div>

          <h1 className="text-[22px] font-bold text-[#0E1C2F] mb-2">Page Not Found</h1>
          <p className="text-[13px] text-[#7A8FA6] mb-6 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Please check the URL or go back to the dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1 py-2.5 px-4 rounded-[10px] text-[13px] font-semibold bg-[#1A56C4] text-white hover:bg-[#0E3A8C] transition-colors text-center">
              Go to Home
            </Link>
            <button onClick={() => { if (typeof window !== 'undefined') window.history.back(); }}
              className="flex-1 py-2.5 px-4 rounded-[10px] text-[13px] font-semibold border border-[#DDE3EE] text-[#3D5068] hover:bg-[#F0F2F7] transition-colors text-center">
              Go Back
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-[#DDE3EE]">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full py-2.5 px-4 rounded-[10px] text-[13px] font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-60"
            >
              {isLoggingOut ? '🔄 Logging out...' : '🚪 Logout & Clear Session'}
            </button>
          </div>

          <p className="text-[11px] text-[#7A8FA6] mt-5">
            Gujarat GMS · If the problem persists, contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
