import { type Dispatch, type SetStateAction } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill/dist/quill.snow.css';

export interface EditorProps {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  setDelta: any;
}

const Editor = ({ content, setContent, setDelta }: EditorProps) => {
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'formula'],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['clean'],
  ];

  return (
    <div className="flex  items-center  bg-gray-50 mt-2">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-4 border border-gray-200">
        <ReactQuill
          modules={{ toolbar: toolbarOptions }}
          theme="snow"
          value={content}
          onChange={(html, _, __, editor) => {
            setDelta(editor.getContents());
            setContent(html);
          }}
          placeholder="Start typing..."
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default Editor;
