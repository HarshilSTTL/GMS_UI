'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function CitizenError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Citizen Portal Error]', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-[20px] border border-[#DDE3EE] shadow-[0_4px_24px_rgba(14,28,47,0.10)] p-10">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} className="text-red-500" />
          </div>
          <h2 className="text-[18px] font-bold text-[#0E1C2F] mb-2">Something went wrong</h2>
          <p className="text-[12px] text-[#7A8FA6] mb-6 leading-relaxed">
            An error occurred while loading this page. Please try again.
          </p>
          {error?.digest && (
            <p className="text-[10px] text-[#A0AEC0] font-mono mb-4">Ref: {error.digest}</p>
          )}
          <div className="flex gap-3">
            <button onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[12px] font-semibold bg-[#1A56C4] text-white hover:bg-[#0E3A8C] transition-colors">
              <RefreshCw size={14} /> Try Again
            </button>
            <Link href="/citizen/dashboard"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] hover:bg-[#F0F2F7] transition-colors">
              <Home size={14} /> Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
