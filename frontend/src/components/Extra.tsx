import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Smile } from 'lucide-react';

const Extra = () => {
  const [text, setText] = useState<any>('');
  const [submitting, setSubmitting] = useState<any>(false);
  const [messages, setMessages] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<any>(false);

  const addMessage = async (e: any) => {
    try {
      e.preventDefault();
      setSubmitting(true);
      const response = await axios.post('http://localhost:3000/add-message', {
        text,
      });
      console.log(' response : ', response);
      if (response.data.success) {
        setMessages([...messages, response.data.mess]);
        setText('');
      }
    } catch (error) {
      console.error(' Error : ', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getMessages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3000/get-all-message');
      console.log(' response : ', response);
      if (response.data.success) {
        setMessages(response.data.message);
      }
    } catch (error) {
      console.error(' Error : ', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto p-4 bg-white shadow-md rounded-2xl flex flex-col space-y-4">
      <div className="flex-1 max-h-80 overflow-y-auto space-y-3 p-2 border rounded-lg">
        {isLoading ? (
          <p className="text-gray-500 text-center">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-400 text-center">No messages yet</p>
        ) : (
          messages.map((mess: any) => (
            <div
              key={mess.id}
              className="bg-gray-100 px-4 py-2 rounded-lg shadow-sm"
            >
              <p className="text-gray-800">{mess.text}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={addMessage} className="flex items-center space-x-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          disabled={submitting}
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Smile className="w-6 h-6 text-gray-600" />
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-14 right-20 z-50">
            <Picker
              data={data}
              theme="dark"
              previewPosition="none"
              onEmojiSelect={(emoji: any) =>
                setText((prev: any) => prev + emoji.native)
              }
            />
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className={`${
            submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          } text-white px-5 py-2 rounded-full transition`}
        >
          {submitting ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Extra;
