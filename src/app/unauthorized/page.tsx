import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#F0F2F7] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-[#0E1C2F] mb-2">Access Denied</h1>
        <p className="text-[#7A8FA6] mb-6">You don't have permission to view this page.</p>
        <Link
          href="/login"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
