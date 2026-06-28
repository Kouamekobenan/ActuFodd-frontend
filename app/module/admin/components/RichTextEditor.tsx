"use client";
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

// ── Icons ─────────────────────────────────────────────────────────────────────

const BoldIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
);
const ItalicIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <line x1="19" y1="4" x2="10" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="20" x2="5" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="15" y1="4" x2="9" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const UnderlineIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" strokeLinecap="round" />
    <line x1="4" y1="21" x2="20" y2="21" strokeLinecap="round" />
  </svg>
);
const StrikeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M17.3 4.9c-2.3-.6-4.4-1-6.2-.9-2.7 0-5.3.7-5.3 3.6 0 1.5 1.8 3.3 6 3.9h.9" strokeLinecap="round" />
    <path d="M21 12H3" strokeLinecap="round" />
    <path d="M7 19.1c2 .5 4 .8 6 .8 2.7 0 5.3-.7 5.3-3.6 0-1.6-1.2-2.7-3.5-3.3" strokeLinecap="round" />
  </svg>
);
const QuoteIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
  </svg>
);
const ListIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <line x1="9" y1="6" x2="20" y2="6" strokeLinecap="round" />
    <line x1="9" y1="12" x2="20" y2="12" strokeLinecap="round" />
    <line x1="9" y1="18" x2="20" y2="18" strokeLinecap="round" />
    <circle cx="4" cy="6" r="1" fill="currentColor" />
    <circle cx="4" cy="12" r="1" fill="currentColor" />
    <circle cx="4" cy="18" r="1" fill="currentColor" />
  </svg>
);
const OrderedListIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <line x1="10" y1="6" x2="21" y2="6" strokeLinecap="round" />
    <line x1="10" y1="12" x2="21" y2="12" strokeLinecap="round" />
    <line x1="10" y1="18" x2="21" y2="18" strokeLinecap="round" />
    <path d="M4 6h1v4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 10h2" strokeLinecap="round" />
    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" />
  </svg>
);
const UndoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M3 7v6h6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" strokeLinecap="round" />
  </svg>
);
const RedoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M21 7v6h-6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" strokeLinecap="round" />
  </svg>
);
const AlignLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
    <line x1="3" y1="12" x2="15" y2="12" strokeLinecap="round" />
    <line x1="3" y1="18" x2="18" y2="18" strokeLinecap="round" />
  </svg>
);
const AlignCenterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
    <line x1="6" y1="12" x2="18" y2="12" strokeLinecap="round" />
    <line x1="4" y1="18" x2="20" y2="18" strokeLinecap="round" />
  </svg>
);
const AlignRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
    <line x1="9" y1="12" x2="21" y2="12" strokeLinecap="round" />
    <line x1="6" y1="18" x2="21" y2="18" strokeLinecap="round" />
  </svg>
);

// ── Toolbar button ─────────────────────────────────────────────────────────────

function ToolBtn({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-all ${
        active
          ? "bg-orange-600 text-white shadow-sm"
          : disabled
          ? "text-gray-300 cursor-not-allowed"
          : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
      }`}
    >
      {children}
    </button>
  );
}

const Divider = () => <div className="w-px h-6 bg-gray-200 mx-1 self-center" />;

// ── Main component ─────────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Écrivez votre contenu ici…",
  minHeight = "220px",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-orange-600 underline" } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none min-h-[inherit] prose prose-sm max-w-none text-gray-800 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL du lien :", prev ?? "https://");
    if (!url) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100 transition-all">

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 bg-gray-50 border-b border-gray-200">

        {/* History */}
        <ToolBtn title="Annuler" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <UndoIcon />
        </ToolBtn>
        <ToolBtn title="Rétablir" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <RedoIcon />
        </ToolBtn>

        <Divider />

        {/* Headings */}
        <ToolBtn
          title="Titre 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <span className="text-xs font-black">H1</span>
        </ToolBtn>
        <ToolBtn
          title="Titre 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <span className="text-xs font-black">H2</span>
        </ToolBtn>
        <ToolBtn
          title="Titre 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <span className="text-xs font-black">H3</span>
        </ToolBtn>

        <Divider />

        {/* Inline formatting */}
        <ToolBtn title="Gras" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <BoldIcon />
        </ToolBtn>
        <ToolBtn title="Italique" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <ItalicIcon />
        </ToolBtn>
        <ToolBtn title="Souligné" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon />
        </ToolBtn>
        <ToolBtn title="Barré" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <StrikeIcon />
        </ToolBtn>

        <Divider />

        {/* Lists */}
        <ToolBtn title="Liste à puces" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <ListIcon />
        </ToolBtn>
        <ToolBtn title="Liste numérotée" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <OrderedListIcon />
        </ToolBtn>
        <ToolBtn title="Citation" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <QuoteIcon />
        </ToolBtn>

        <Divider />

        {/* Alignment */}
        <ToolBtn title="Aligner à gauche" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeftIcon />
        </ToolBtn>
        <ToolBtn title="Centrer" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenterIcon />
        </ToolBtn>
        <ToolBtn title="Aligner à droite" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRightIcon />
        </ToolBtn>

        <Divider />

        {/* Link */}
        <ToolBtn title="Insérer un lien" active={editor.isActive("link")} onClick={addLink}>
          <LinkIcon />
        </ToolBtn>

        {/* Word count */}
        <span className="ml-auto text-[10px] text-gray-400 font-medium pr-1">
          {editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length} mots
        </span>
      </div>

      {/* ── Editor area ── */}
      <div className="px-4 py-3 bg-white" style={{ minHeight }}>
        <style>{`
          .ProseMirror p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: #9ca3af;
            pointer-events: none;
            height: 0;
          }
          .ProseMirror h1 { font-size: 1.75rem; font-weight: 800; margin: 0.75rem 0 0.5rem; line-height: 1.2; }
          .ProseMirror h2 { font-size: 1.35rem; font-weight: 700; margin: 0.65rem 0 0.4rem; }
          .ProseMirror h3 { font-size: 1.1rem; font-weight: 700; margin: 0.5rem 0 0.35rem; }
          .ProseMirror p { margin: 0.4rem 0; }
          .ProseMirror ul { list-style: disc; padding-left: 1.4rem; margin: 0.4rem 0; }
          .ProseMirror ol { list-style: decimal; padding-left: 1.4rem; margin: 0.4rem 0; }
          .ProseMirror blockquote {
            border-left: 3px solid #f97316;
            padding-left: 1rem;
            margin: 0.6rem 0;
            color: #6b7280;
            font-style: italic;
          }
          .ProseMirror strong { font-weight: 700; }
          .ProseMirror em { font-style: italic; }
          .ProseMirror u { text-decoration: underline; }
          .ProseMirror s { text-decoration: line-through; }
          .ProseMirror a { color: #ea580c; text-decoration: underline; cursor: pointer; }
        `}</style>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
