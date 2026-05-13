import React from 'react';

export default function CitizenVoiceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#ECE5DD]">
      {children}
    </div>
  );
}
