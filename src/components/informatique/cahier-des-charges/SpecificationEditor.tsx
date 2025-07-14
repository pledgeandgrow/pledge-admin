import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlock from '@tiptap/extension-code-block';

import { Toggle } from '@/components/ui/toggle';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Highlighter,
  Table as TableIcon,
  Image as ImageIcon,
  CheckSquare,
  Code,
  Undo,
  Redo,
  Quote,
  Minus,
  FileCode
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Document } from '@/types/documents';
import { SpecificationMetadata } from './types';

interface SpecificationEditorProps {
  content: string;
  onChange: (content: string) => void;
  document?: Document;
}

export function SpecificationEditor({ content, onChange }: SpecificationEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder: 'Commencez à rédiger votre cahier des charges...',
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'rounded-md bg-muted p-4',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    icon: Icon, 
    onClick, 
    isActive = false,
    tooltip
  }: { 
    icon: React.ElementType, 
    onClick: () => void, 
    isActive?: boolean,
    tooltip: string
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            pressed={isActive}
            onPressedChange={onClick}
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <Icon className="h-4 w-4" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const addImage = () => {
    const url = window.prompt('URL de l\'image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const addCodeBlock = () => {
    const language = window.prompt('Langage (ex: javascript, python):', 'javascript');
    if (language) {
      editor.chain().focus().setCodeBlock({ language }).run();
    }
  };

  return (
    <div className="border rounded-lg">
      <div className="flex flex-wrap gap-1 p-2 border-b">
        <div className="flex items-center gap-1 mr-2">
          <ToolbarButton
            icon={Undo}
            onClick={() => editor.chain().focus().undo().run()}
            tooltip="Annuler"
          />
          <ToolbarButton
            icon={Redo}
            onClick={() => editor.chain().focus().redo().run()}
            tooltip="Refaire"
          />
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        <div className="flex items-center gap-1 mr-2">
          <ToolbarButton
            icon={Bold}
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            tooltip="Gras"
          />
          <ToolbarButton
            icon={Italic}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            tooltip="Italique"
          />
          <ToolbarButton
            icon={UnderlineIcon}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            tooltip="Souligné"
          />
          <ToolbarButton
            icon={Strikethrough}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            tooltip="Barré"
          />
          <ToolbarButton
            icon={Highlighter}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
            tooltip="Surligner"
          />
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        <div className="flex items-center gap-1 mr-2">
          <ToolbarButton
            icon={Heading1}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            tooltip="Titre 1"
          />
          <ToolbarButton
            icon={Heading2}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            tooltip="Titre 2"
          />
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        <div className="flex items-center gap-1 mr-2">
          <ToolbarButton
            icon={List}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            tooltip="Liste à puces"
          />
          <ToolbarButton
            icon={ListOrdered}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            tooltip="Liste numérotée"
          />
          <ToolbarButton
            icon={CheckSquare}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive('taskList')}
            tooltip="Liste de tâches"
          />
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        <div className="flex items-center gap-1 mr-2">
          <ToolbarButton
            icon={AlignLeft}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            tooltip="Aligner à gauche"
          />
          <ToolbarButton
            icon={AlignCenter}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            tooltip="Centrer"
          />
          <ToolbarButton
            icon={AlignRight}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            tooltip="Aligner à droite"
          />
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={Quote}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            tooltip="Citation"
          />
          <ToolbarButton
            icon={Minus}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            tooltip="Ligne horizontale"
          />
          <ToolbarButton
            icon={TableIcon}
            onClick={addTable}
            isActive={editor.isActive('table')}
            tooltip="Insérer un tableau"
          />
          <ToolbarButton
            icon={ImageIcon}
            onClick={addImage}
            tooltip="Insérer une image"
          />
          <ToolbarButton
            icon={Code}
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            tooltip="Code en ligne"
          />
          <ToolbarButton
            icon={FileCode}
            onClick={addCodeBlock}
            isActive={editor.isActive('codeBlock')}
            tooltip="Bloc de code"
          />
          <ToolbarButton
            icon={LinkIcon}
            onClick={() => {
              const url = window.prompt('URL:');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            isActive={editor.isActive('link')}
            tooltip="Insérer un lien"
          />
        </div>
      </div>

      <EditorContent 
        editor={editor} 
        className="prose dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none"
      />

      <div className="flex items-center justify-between p-2 border-t text-xs text-muted-foreground">
        <div>
          Astuce: Utilisez Ctrl+B pour le gras, Ctrl+I pour l&apos;italique, Ctrl+U pour souligner
        </div>
        <div>
          {editor.storage.characterCount?.words()} mots
        </div>
      </div>
    </div>
  );
}
