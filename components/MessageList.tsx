
import { ChatMessage } from '@/server/types';

interface MessageListProps {
    messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
    return (
        <div className="space-y-4">
            {messages.map((message) => (
                <div key={message.id} className="flex space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#36393f] flex-shrink-0" /> {/* Avatar placeholder */}
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">
                                {message.sender.username}
                            </span>
                            <span className="text-xs text-gray-400">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                        <p className="text-gray-200">{message.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
