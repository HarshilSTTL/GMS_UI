'use client';

export function WorkCardSkeleton() {
  return (
    <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden animate-pulse">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#DDE3EE] flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="h-3 bg-[#E5E7EB] rounded w-40 mb-2" />
          <div className="h-5 bg-[#E5E7EB] rounded w-64 mb-2" />
          <div className="h-3 bg-[#E5E7EB] rounded w-48" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="h-5 bg-[#E5E7EB] rounded-full w-14" />
          <div className="h-5 bg-[#E5E7EB] rounded-full w-16" />
          <div className="h-5 bg-[#E5E7EB] rounded-full w-20" />
        </div>
      </div>
      {/* Body */}
      <div className="px-5 py-4 space-y-3">
        <div className="flex gap-4">
          <div className="h-5 bg-[#E5E7EB] rounded w-16" />
          <div className="h-5 bg-[#E5E7EB] rounded w-16" />
          <div className="h-5 bg-[#E5E7EB] rounded w-16" />
        </div>
        <div className="h-16 bg-[#F0F2F7] rounded-lg" />
        <div className="h-20 bg-[#F0F2F7] rounded-lg" />
      </div>
      {/* Action area */}
      <div className="px-5 py-4 border-t border-[#DDE3EE] space-y-3">
        <div className="h-16 bg-[#F0F2F7] rounded-lg" />
        <div className="flex gap-2">
          <div className="h-8 bg-[#E5E7EB] rounded w-28" />
          <div className="h-8 bg-[#E5E7EB] rounded w-28" />
          <div className="h-8 bg-[#E5E7EB] rounded w-28" />
        </div>
      </div>
    </div>
  );
}

export function GroupCardSkeleton() {
  return (
    <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden animate-pulse">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#DDE3EE] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 bg-[#E5E7EB] rounded w-20" />
          <div className="h-5 bg-[#FFF7ED] rounded-full w-24 border border-[#FDDCAF]" />
          <div className="h-5 bg-[#E5E7EB] rounded-full w-16" />
        </div>
        <div className="h-8 bg-[#E5E7EB] rounded w-28" />
      </div>
      {/* Title */}
      <div className="px-4 py-3">
        <div className="h-5 bg-[#E5E7EB] rounded w-64 mb-2" />
        <div className="h-3 bg-[#E5E7EB] rounded w-48" />
      </div>
      {/* Group items */}
      <div className="px-4 pb-4 space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3 p-2.5 bg-[#F8FAFD] rounded-lg">
            <div className="w-5 h-5 bg-[#E5E7EB] rounded" />
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-[#E5E7EB] rounded w-32" />
              <div className="h-3 bg-[#E5E7EB] rounded w-40" />
            </div>
            <div className="h-5 bg-[#E5E7EB] rounded-full w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
