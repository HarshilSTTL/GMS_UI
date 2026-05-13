'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GMS Error]', error);
  }, [error]);

  return (
    <html>
      <body style={{ margin: 0, fontFamily: 'Inter, sans-serif', background: '#F0F2F7' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #DDE3EE', boxShadow: '0 4px 24px rgba(14,28,47,0.10)', padding: '40px 32px' }}>

              {/* Error icon */}
              <div style={{ width: 64, height: 64, borderRadius: 16, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>

              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0E1C2F', margin: '0 0 8px' }}>
                Something went wrong
              </h1>
              <p style={{ fontSize: 13, color: '#7A8FA6', margin: '0 0 6px', lineHeight: 1.6 }}>
                An unexpected error occurred. Our team has been notified.
              </p>
              {error?.digest && (
                <p style={{ fontSize: 11, color: '#A0AEC0', margin: '0 0 24px', fontFamily: 'monospace' }}>
                  Error ID: {error.digest}
                </p>
              )}
              {!error?.digest && <div style={{ marginBottom: 24 }} />}

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={reset}
                  style={{ flex: 1, padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: '#1A56C4', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  Try Again
                </button>
                <a
                  href="/"
                  style={{ flex: 1, padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, border: '1px solid #DDE3EE', color: '#3D5068', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  Go to Home
                </a>
              </div>

              <p style={{ fontSize: 11, color: '#7A8FA6', marginTop: 20 }}>
                Gujarat GMS · If the problem persists, contact support.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
