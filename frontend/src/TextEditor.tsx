import React, { useRef, useEffect } from 'react';
import EditorJS from '@editorjs/editorjs';
import type { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';

interface TextEditorProps {
  initialData?: OutputData;
  readOnly?: boolean;
  placeholder?: string;
  onChange?: (data: OutputData) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  initialData,
  readOnly = false,
  placeholder = 'Start writing...',
  onChange,
}) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!holderRef.current) return;

    const editor = new EditorJS({
      holder: holderRef.current,
      tools: {
        header: {
          class: Header,
          inlineToolbar: ['marker', 'link'],
          config: {
            placeholder: 'Header',
          },
          shortcut: 'CMD+SHIFT+H',
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
      },
      data: initialData || {},
      readOnly,
      autofocus: true,
      placeholder,
      onReady: () => {
        console.log('Editor is ready');
      },
      onChange: async () => {
        if (editorRef.current && onChange) {
          const data = await editorRef.current.save();
          onChange(data);
        }
      },
      logLevel: 'ERROR', // can be VERBOSE, INFO, WARN
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [initialData, readOnly, placeholder, onChange]);

  const saveContent = async () => {
    try {
      const data = await editorRef.current?.save();
      console.log('Saved data:', data);
      return data;
    } catch (err) {
      console.error('Error saving content:', err);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <div
        ref={holderRef}
        className="border-2 border-gray-300 rounded-lg p-4 mb-4 bg-white"
        style={{ minHeight: '300px' }}
      ></div>
      <div className="flex justify-end">
        <button
          onClick={saveContent}
          className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
