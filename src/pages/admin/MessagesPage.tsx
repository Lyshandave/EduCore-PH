import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Search, MessageSquare } from 'lucide-react';
import { useMessageStore, useAuthStore } from '@/stores';
import { format } from 'date-fns';

const branchColors: Record<string, string> = {
  'Main Campus': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'North Branch': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'South Campus': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export function MessagesPage() {
  const { user } = useAuthStore();
  const { chats, activeChatId, setActiveChat, sendMessage, markAsRead } = useMessageStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const filteredChats = chats.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.branch || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!replyText.trim() || !user || !activeChat) return;
    sendMessage(activeChat.id, replyText, {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role
    });
    setReplyText('');
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId);
    markAsRead(chatId);
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 9rem)' }}>
      {/* Page Header */}
      <div className="mb-4 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Messages
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 text-sm">
          <MessageSquare className="h-4 w-4" />
          Admin receives messages from ALL branches. Reply to anyone.
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex flex-1 min-h-0 overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl bg-white shadow-sm dark:bg-slate-950">

        {/* ── Sidebar ── */}
        <div className="w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/10">
          {/* Search */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search name or branch..."
                className="pl-9 h-9 bg-white dark:bg-slate-950 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Chat list */}
          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              {filteredChats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white dark:hover:bg-slate-900/50 ${
                    activeChat.id === chat.id
                      ? 'bg-white dark:bg-slate-900 border-l-2 border-blue-600 shadow-sm'
                      : 'border-l-2 border-transparent'
                  }`}
                >
                  <Avatar className="h-9 w-9 shrink-0 border border-slate-100 dark:border-slate-800">
                    <AvatarFallback className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-semibold text-sm">
                      {chat.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`font-semibold text-sm truncate ${chat.unread ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                        {chat.name}
                      </span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{chat.time}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`inline-flex items-center rounded-full px-1.5 py-px text-[9px] font-semibold ${branchColors[chat.branch || ''] || 'bg-slate-100 text-slate-600'}`}>
                        {chat.branch}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 px-1.5 py-px text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                        {chat.role}
                      </span>
                    </div>
                    <p className={`text-xs truncate mt-1 ${chat.unread ? 'font-medium text-slate-800 dark:text-slate-200' : 'text-slate-500'}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread && <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-2" />}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* ── Main Chat Area ── */}
        <div className="flex-1 min-w-0 flex flex-col bg-white dark:bg-slate-950">
          {/* Chat Header */}
          <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between pl-8 pr-5 shrink-0 bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">{activeChat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h2 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{activeChat.name}</h2>
                <p className="text-[11px] text-slate-500">{activeChat.role} • {activeChat.branch}</p>
              </div>
            </div>
            <Badge variant="outline" className={`shrink-0 text-xs ${activeChat.branch ? branchColors[activeChat.branch] : ''}`}>
              {activeChat.branch}
            </Badge>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 pl-8 pr-5 py-4 bg-slate-50/50 dark:bg-slate-900/10">
            <div className="flex flex-col gap-4">
              {activeChat.messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                    {!isMe && (
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarFallback className="text-[10px]">{msg.senderName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`rounded-2xl px-4 py-2.5 text-sm max-w-[80%] shadow-sm ${
                      isMe 
                        ? 'bg-blue-600 text-white rounded-br-sm' 
                        : 'bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700 rounded-bl-sm dark:text-slate-200'
                    }`}>
                      {msg.content}
                      <div className={`text-[9px] mt-1 ${isMe ? 'text-blue-100/70 text-right' : 'text-slate-400'}`}>
                        {format(new Date(msg.timestamp), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Reply Input */}
          <div className="pl-8 pr-4 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
            <div className="flex gap-2">
              <Input
                placeholder="Reply to this message..."
                className="flex-1 bg-slate-50 dark:bg-slate-900"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                onClick={handleSendMessage}
                size="icon" 
                className="bg-blue-600 hover:bg-blue-700 shrink-0 shadow-md shadow-blue-600/20"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
