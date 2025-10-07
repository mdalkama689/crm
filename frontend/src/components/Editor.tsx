import {
  useState,
  type Dispatch,
  type SetStateAction,
  useRef,
  useEffect,
} from 'react';
import ReactQuill from 'react-quill-new';

export interface EditorProps {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  setDelta: any;
}

const Editor = ({ content, setContent, setDelta }: EditorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'formula'],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['clean'],
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {isExpanded && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"></div>
      )}

      <div
        ref={editorRef}
        className={`transition-all duration-300 z-50 ${
          isExpanded
            ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[200px]'
            : 'w-full max-w-3xl mt-2'
        }`}
      >
        <div
          onClick={() => setIsExpanded(true)}
          className="bg-white  rounded-2xl border border-gray-200 w-full h-full flex flex-col"
        >
          <ReactQuill
            modules={{ toolbar: isExpanded ? toolbarOptions : false }}
            theme="snow"
            value={content}
            onChange={(html, _, __, editor) => {
              setDelta(editor.getContents());
              setContent(html);
            }}
            placeholder="Start typing..."
            className="rounded-lg flex-1 overflow-y-auto"
          />
        </div>
      </div>
    </>
  );
};

export default Editor;
