
"use client";

import { ChatMessage } from '@/server/types';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from './ui/scroll-area';

interface MessageListProps {
    messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
    return (
        <ScrollArea className="h-full p-4">
            <div className="space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className="flex space-x-3 group">
                        <div className="w-8 h-8 rounded-full bg-[#36393f] flex-shrink-0 flex items-center justify-center text-xs">
                            {message.sender.username[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-medium text-white">
                                    {message.sender.username}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="prose prose-sm prose-invert max-w-none">
                                <ReactMarkdown>
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
