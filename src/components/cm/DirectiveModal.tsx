'use client';
import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';

interface DirectiveModalProps {
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onDispatch: (editedContent: string) => void;
}

export function DirectiveModal({ isOpen, title, content, onClose, onDispatch }: DirectiveModalProps) {
  const [editedContent, setEditedContent] = useState(content);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditedContent(content);
    setCopied(false);
  }, [content, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    function handleBackdropClick(e: MouseEvent) {
      if (e.target === modalRef.current) onClose();
    }

    document.addEventListener('keydown', handleEscape);
    modalRef.current?.addEventListener('click', handleBackdropClick);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      modalRef.current?.removeEventListener('click', handleBackdropClick);
    };
  }, [isOpen, onClose]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(editedContent);
      setCopied(true);
      setTimeout(() => {
        onDispatch(editedContent);
        onClose();
      }, 1500);
    } catch {
      alert('Failed to copy to clipboard');
    }
  }

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={e => e.target === modalRef.current && onClose()}
    >
      <div className="bg-white rounded-[14px] shadow-xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDE3EE]">
          <h2 className="text-[14px] font-bold text-[#0E1C2F]">Draft CM Directive</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F0F2F7] transition-colors"
            aria-label="Close modal"
          >
            <X size={18} className="text-[#7A8FA6]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-[11px] text-[#7A8FA6] mb-3">{title}</p>
          <textarea
            value={editedContent}
            onChange={e => setEditedContent(e.target.value)}
            className="w-full h-64 px-3 py-2.5 border-2 border-[#DDE3EE] rounded-[10px] text-[12px] text-[#0E1C2F] resize-none focus:border-blue-500 focus:outline-none"
            placeholder="Directive content..."
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#DDE3EE] flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] text-[#3D5068] bg-white hover:bg-[#F0F2F7] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-[10px] text-[12px] font-semibold text-white transition-all"
            style={{
              background: copied ? '#16A34A' : '#0891B2',
            }}
          >
            {copied ? '✓ Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
