import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  name: string;
  role: string;
  branch?: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: ChatMessage[];
}

interface MessageState {
  chats: Chat[];
  activeChatId: string | null;
  
  // Actions
  setActiveChat: (chatId: string) => void;
  sendMessage: (chatId: string, content: string, sender: { id: string, name: string, role: string }) => void;
  receiveMessage: (chatId: string, content: string, sender: { id: string, name: string, role: string }) => void;
  markAsRead: (chatId: string) => void;
  startNewChat: (participant: { id: string, name: string, role: string, branch?: string }) => string;
}

const initialChats: Chat[] = [
  {
    id: 'chat-student-1',
    name: 'Alipio, Juan',
    role: 'Student',
    branch: 'Main Campus',
    lastMessage: 'Good afternoon sir, regarding my enrollment...',
    time: '10:30 AM',
    unread: true,
    messages: [
      {
        id: 'msg-1',
        senderId: 'student-1',
        senderName: 'Alipio, Juan',
        senderRole: 'student',
        content: 'Good afternoon sir, regarding my enrollment...',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      }
    ]
  },
  {
    id: 'chat-staff-1',
    name: 'Prof. Cruz',
    role: 'Staff',
    branch: 'Main Campus',
    lastMessage: 'The grade sheets have been submitted.',
    time: '9:45 AM',
    unread: true,
    messages: [
      {
        id: 'msg-2',
        senderId: 'staff-1',
        senderName: 'Prof. Cruz',
        senderRole: 'staff',
        content: 'The grade sheets have been submitted.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      }
    ]
  },
  {
    id: 'chat-admin-1',
    name: 'Main Admin',
    role: 'Admin',
    branch: 'Global',
    lastMessage: 'Your enrollment is validated.',
    time: 'Yesterday',
    unread: false,
    messages: [
      {
        id: 'msg-3',
        senderId: 'admin-1',
        senderName: 'Main Admin',
        senderRole: 'admin',
        content: 'Your enrollment is validated.',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      }
    ]
  }
];

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      chats: initialChats,
      activeChatId: 'chat-student-1',

      setActiveChat: (chatId) => set({ activeChatId: chatId }),

      sendMessage: (chatId, content, sender) => {
        set((state) => {
          const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: sender.id,
            senderName: sender.name,
            senderRole: sender.role,
            content,
            timestamp: new Date().toISOString(),
          };

          return {
            chats: state.chats.map((chat) => 
              chat.id === chatId 
                ? { 
                    ...chat, 
                    messages: [...chat.messages, newMsg],
                    lastMessage: content,
                    time: 'Just now',
                    unread: false 
                  } 
                : chat
            )
          };
        });
      },

      receiveMessage: (chatId, content, sender) => {
        set((state) => {
          const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: sender.id,
            senderName: sender.name,
            senderRole: sender.role,
            content,
            timestamp: new Date().toISOString(),
          };

          return {
            chats: state.chats.map((chat) => 
              chat.id === chatId 
                ? { 
                    ...chat, 
                    messages: [...chat.messages, newMsg],
                    lastMessage: content,
                    time: 'Just now',
                    unread: true 
                  } 
                : chat
            )
          };
        });
      },

      markAsRead: (chatId) => {
        set((state) => ({
          chats: state.chats.map((chat) => 
            chat.id === chatId ? { ...chat, unread: false } : chat
          )
        }));
      },

      startNewChat: (participant) => {
        const { chats } = get();
        const existingChat = chats.find(c => c.id === `chat-${participant.id}`);
        
        if (existingChat) {
          set({ activeChatId: existingChat.id });
          return existingChat.id;
        }

        const newChat: Chat = {
          id: `chat-${participant.id}`,
          name: participant.name,
          role: participant.role,
          branch: participant.branch || 'Main Campus',
          lastMessage: '',
          time: 'New',
          unread: false,
          messages: []
        };

        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChatId: newChat.id
        }));

        return newChat.id;
      }
    }),
    {
      name: 'educore-messages',
    }
  )
);
