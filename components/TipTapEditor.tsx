'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import {
  Bold, Italic,
  Heading1, Heading2,
  List, ListOrdered,
  Quote,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Toolbar helpers ──────────────────────────────────────────────────────────

function Btn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault(); // nie odbiera focusu z edytora
        onClick();
      }}
      className={cn(
        'h-7 w-7 flex items-center justify-center rounded-lg transition-colors',
        active
          ? 'bg-[#1C1C1E] text-white'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-4 bg-gray-200 mx-1" />;
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  content: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export default function TipTapEditor({
  content,
  onChange,
  placeholder = 'Co dzisiaj przeżyłaś?',
  editable = true,
}: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable,
    immediatelyRender: true,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  // sync content prop → editor (np. reset po zapisie)
  useEffect(() => {
    if (!editor) return;
    const cur = editor.getHTML();
    const isEmpty = (h: string) => h === '' || h === '<p></p>';
    if (isEmpty(cur) && isEmpty(content)) return;
    if (cur !== content) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editable, editor]);

  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden transition-colors',
        editable
          ? 'border border-gray-200 bg-white focus-within:border-gray-400'
          : 'border-0 bg-transparent'
      )}
    >
      {/* ── Toolbar (tylko tryb edycji) ────────────────────────────────────── */}
      {editable && editor && (
        <div className="flex items-center gap-0.5 px-3 pt-2.5 pb-2 border-b border-gray-100 flex-wrap">
          <Btn
            title="Pogrubienie (Ctrl+B)"
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
          >
            <Bold size={14} strokeWidth={2.5} />
          </Btn>

          <Btn
            title="Kursywa (Ctrl+I)"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
          >
            <Italic size={14} strokeWidth={2.5} />
          </Btn>

          <Sep />

          <Btn
            title="Nagłówek 1"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor.isActive('heading', { level: 1 })}
          >
            <Heading1 size={14} strokeWidth={2.5} />
          </Btn>

          <Btn
            title="Nagłówek 2"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive('heading', { level: 2 })}
          >
            <Heading2 size={14} strokeWidth={2.5} />
          </Btn>

          <Sep />

          <Btn
            title="Lista punktowana"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
          >
            <List size={14} strokeWidth={2.5} />
          </Btn>

          <Btn
            title="Lista numerowana"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
          >
            <ListOrdered size={14} strokeWidth={2.5} />
          </Btn>

          <Sep />

          <Btn
            title="Cytat"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
          >
            <Quote size={14} strokeWidth={2.5} />
          </Btn>
        </div>
      )}

      {/* ── Edytor ────────────────────────────────────────────────────────── */}
      <div className="relative">
        {editor?.isEmpty && editable && (
          <p className="absolute top-3 left-4 text-gray-400 pointer-events-none text-sm select-none">
            {placeholder}
          </p>
        )}

        <EditorContent
          editor={editor}
          className={cn(
            'px-4 py-3 text-sm',
            /* edytor */
            '[&_.tiptap]:outline-none',
            editable && '[&_.tiptap]:min-h-[140px]',
            /* paragrafy */
            '[&_.tiptap_p]:leading-relaxed [&_.tiptap_p]:my-0.5',
            /* nagłówki */
            '[&_.tiptap_h1]:text-xl [&_.tiptap_h1]:font-semibold [&_.tiptap_h1]:font-[family-name:var(--font-display)] [&_.tiptap_h1]:mt-3 [&_.tiptap_h1]:mb-1',
            '[&_.tiptap_h2]:text-base [&_.tiptap_h2]:font-semibold [&_.tiptap_h2]:font-[family-name:var(--font-display)] [&_.tiptap_h2]:mt-2 [&_.tiptap_h2]:mb-0.5',
            /* listy */
            '[&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5 [&_.tiptap_ul]:my-1.5',
            '[&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5 [&_.tiptap_ol]:my-1.5',
            '[&_.tiptap_li]:my-0.5',
            /* cytat */
            '[&_.tiptap_blockquote]:border-l-[3px] [&_.tiptap_blockquote]:border-gray-300 [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:text-gray-500 [&_.tiptap_blockquote]:italic [&_.tiptap_blockquote]:my-2',
            /* inline */
            '[&_.tiptap_strong]:font-semibold',
            '[&_.tiptap_em]:italic',
            '[&_.tiptap_s]:line-through [&_.tiptap_s]:text-gray-400',
            '[&_.tiptap_code]:bg-gray-100 [&_.tiptap_code]:rounded [&_.tiptap_code]:px-1.5 [&_.tiptap_code]:py-0.5 [&_.tiptap_code]:font-mono [&_.tiptap_code]:text-xs [&_.tiptap_code]:text-gray-700',
          )}
        />
      </div>
    </div>
  );
}
