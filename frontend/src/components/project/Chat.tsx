import { ChevronRight, User } from 'lucide-react';
import { messages } from './constant';

const Chat = () => {
 

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">Messages</span>
          <div className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
            4
          </div>
        </div>
        <div className="flex items-center gap-1 text-blue-500 cursor-pointer">
          <span className="text-sm">View all</span>
          <ChevronRight size={16} />
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-slate-500 rounded-full flex items-center justify-center text-white font-medium">
                <User size={20} />
              </div>
              {message.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {message.name}
                </h4>
                <span className="text-xs text-gray-500">{message.time}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">
                {message.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
