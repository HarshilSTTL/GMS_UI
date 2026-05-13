import React from 'react';

export default function SwagatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {children}
    </div>
  );
}
