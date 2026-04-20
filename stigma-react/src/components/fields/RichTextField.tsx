import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { useEffect } from 'react';
import type { StigmaField } from '../../types/stigma';
import { FieldLabel } from './FieldLabel';

export interface RichTextFieldProps {
  label: string;
  field: StigmaField;
  fqn: string;
  disabled?: boolean;
  onChange: (fqn: string, html: string) => void;
}

const BTN = 'px-2 py-0.5 text-xs rounded border border-gray-300 bg-white hover:bg-gray-100';

export function RichTextField({ label, field, fqn, disabled, onChange }: RichTextFieldProps) {
  const html = typeof field.data === 'string' ? field.data : '';
  const readOnly = disabled || field.changeable === false || field.changeable === 'false';

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: html,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(fqn, editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== html) {
      editor.commands.setContent(html || '', { emitUpdate: false });
    }
  }, [html, editor]);

  useEffect(() => {
    editor?.setEditable(!readOnly);
  }, [editor, readOnly]);

  if (readOnly) {
    return (
      <FieldLabel label={label}>
        <div
          className="border border-gray-300 rounded bg-white overflow-y-auto p-2 font-normal"
          style={{ width: 950, height: 145, maxWidth: '100%' }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </FieldLabel>
    );
  }

  return (
    <FieldLabel label={label}>
      <div className="w-full" style={{ maxWidth: 950 }}>
        <div className="flex flex-wrap gap-1 mb-1">
          <button type="button" className={BTN} onClick={() => editor?.chain().focus().toggleBold().run()}>
            B
          </button>
          <button type="button" className={BTN} onClick={() => editor?.chain().focus().toggleItalic().run()}>
            I
          </button>
          <button
            type="button"
            className={BTN}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          >
            U
          </button>
          <button
            type="button"
            className={BTN}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          >
            S
          </button>
          <button
            type="button"
            className={BTN}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            • List
          </button>
          <button
            type="button"
            className={BTN}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            1. List
          </button>
          <button
            type="button"
            className={BTN}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            Quote
          </button>
          <button
            type="button"
            className={BTN}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          >
            Code
          </button>
        </div>
        <div
          className="border border-gray-300 rounded bg-white overflow-y-auto"
          style={{ width: 950, height: 145, maxWidth: '100%' }}
        >
          <EditorContent
            editor={editor}
            className="prose prose-sm max-w-none p-2 focus:outline-none font-normal"
          />
        </div>
      </div>
    </FieldLabel>
  );
}
