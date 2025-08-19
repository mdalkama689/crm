import { useState } from 'react';
import { Button } from '../ui/button';
import Chat from './Chat';
import Overview from './Overview';

const ChatPanel = () => {
  const [showChat, setShowChat] = useState<boolean>(true);

  return (
    <div className="bg-white rounded-lg shadow-sm border w-full max-w-[350px] p-4 h-[100vh]">
      <div className="flex gap-2 mb-6">
        <Button
          className={`bg-transparent text-gray-600 px-6 py-2 border border-gray-300 rounded-full text-sm font-medium hover:text-white hover:bg-slate-800 cursor-pointer ${showChat && 'bg-slate-800 text-white'}`}
          onClick={() => setShowChat(true)}
        >
          Chats
        </Button>
        <Button
          className={`bg-transparent text-gray-600 px-6 py-2 rounded-full text-sm font-medium border border-gray-300 hover:bg-slate-800 cursor-pointer hover:text-white ${!showChat && 'bg-slate-800 text-white'}`}
          onClick={() => setShowChat(false)}
        >
          Overview
        </Button>
      </div>

      {showChat ? <Chat /> : <Overview />}
    </div>
  );
};

export default ChatPanel;
