import React, { createContext, useContext, useState } from "react";

type AssistantSettings = {
  mode: "default" | "personalized";
  gender: "feminine" | "masculine" | "neutral";
  tone: "formal" | "cordial" | "humorous";
  name: string;
};

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

type ChatContextType = {
  messages: Message[];
  assistantSettings: AssistantSettings;
  addMessage: (content: string, role: Message["role"]) => void;
  clearMessages: () => void;
  updateAssistantSettings: (settings: Partial<AssistantSettings>) => void;
};

const defaultAssistantSettings: AssistantSettings = {
  mode: "default",
  gender: "neutral",
  tone: "cordial",
  name: "Sam",
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [assistantSettings, setAssistantSettings] = useState<AssistantSettings>(
    defaultAssistantSettings
  );

  const addMessage = (content: string, role: Message["role"]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const updateAssistantSettings = (settings: Partial<AssistantSettings>) => {
    setAssistantSettings((prev) => ({ ...prev, ...settings }));
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        assistantSettings,
        addMessage,
        clearMessages,
        updateAssistantSettings,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
