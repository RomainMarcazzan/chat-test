import React, { createContext, useContext, useState } from "react";

export type AssistantSettings = {
  mode: "default" | "personalized";
  gender: "feminine" | "masculine" | "neutral";
  tone: "formal" | "cordial" | "humorous";
  name: string;
};

export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  step?: SetupStep;
  isLastMessage?: boolean;
  videoUri?: string;
};

export type SetupStep = "mode" | "gender" | "tone" | "name" | "final";
export const stepOrder: SetupStep[] = [
  "mode",
  "gender",
  "tone",
  "name",
  "final",
];

type AssistantSetupState = {
  currentStep: SetupStep;
  selectedOption: string | null;
  isCustomName: boolean;
  customName: string;
  selectedName: string;
};

type ChatContextType = {
  messages: Message[];
  assistantSettings: AssistantSettings;
  addMessage: (
    content: string,
    role: Message["role"],
    step?: SetupStep,
    isLastMessage?: boolean,
    videoUri?: string
  ) => void;
  clearMessages: () => void;
  updateAssistantSettings: (settings: Partial<AssistantSettings>) => void;
  assistantSetup: AssistantSetupState;
  handleOptionSelect: (value: string) => void;
  handleValidateChoice: () => void;
  handleValidateCustomName: () => void;
  resetAssistantSetup: () => void;
  setCustomName: (name: string) => void;
  goToStep: (step: SetupStep) => void;
};

const defaultAssistantSettings: AssistantSettings = {
  mode: "personalized",
  gender: "neutral",
  tone: "formal",
  name: "Sam",
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [assistantSettings, setAssistantSettings] = useState<AssistantSettings>(
    defaultAssistantSettings
  );

  const [assistantSetup, setAssistantSetup] = useState<AssistantSetupState>({
    currentStep: "mode",
    selectedOption: null,
    isCustomName: false,
    customName: "",
    selectedName: "",
  });

  const addMessage = (
    content: string,
    role: Message["role"],
    step?: SetupStep,
    isLastMessage?: boolean,
    videoUri?: string
  ) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      content,
      role,
      timestamp: new Date(),
      step,
      isLastMessage,
      videoUri,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const updateAssistantSettings = (settings: Partial<AssistantSettings>) => {
    setAssistantSettings((prev) => {
      const updated = { ...prev, ...settings };
      return updated;
    });
  };

  const handleOptionSelect = (value: string) => {
    setAssistantSetup((prev) => ({ ...prev, selectedOption: value }));
  };

  const handleValidateChoice = () => {
    const { currentStep, selectedOption } = assistantSetup;
    if (!selectedOption) return;
    if (currentStep === "mode" && selectedOption === "default") {
      updateAssistantSettings({
        mode: "default",
        gender: "neutral",
        tone: "cordial",
        name: "Sam",
      });
      setAssistantSetup((prev) => ({
        ...prev,
        currentStep: "final",
        selectedOption: null,
      }));
      return;
    }
    if (currentStep === "name") {
      if (selectedOption === "default") {
        setAssistantSetup((prev) => ({ ...prev, selectedName: "Sam" }));
        updateAssistantSettings({ name: "Sam" });
      } else {
        setAssistantSetup((prev) => ({ ...prev, isCustomName: true }));
        return;
      }
    } else {
      updateAssistantSettings({ [currentStep]: selectedOption } as any);
    }
    let nextStep: SetupStep = currentStep;
    switch (currentStep) {
      case "mode":
        nextStep = "gender";
        break;
      case "gender":
        nextStep = "tone";
        break;
      case "tone":
        nextStep = "name";
        break;
      case "name":
        nextStep = "final";
        break;
    }
    setAssistantSetup((prev) => ({
      ...prev,
      currentStep: nextStep,
      selectedOption: null,
    }));
  };

  const handleValidateCustomName = () => {
    const { customName } = assistantSetup;
    if (customName.trim()) {
      const name = customName.trim();
      setAssistantSetup((prev) => ({
        ...prev,
        selectedName: name,
        currentStep: "final",
        isCustomName: false,
      }));
      updateAssistantSettings({ name });
    }
  };

  const resetAssistantSetup = () => {
    setAssistantSetup({
      currentStep: "mode",
      selectedOption: null,
      isCustomName: false,
      customName: "",
      selectedName: "",
    });
  };

  const setCustomName = (name: string) => {
    setAssistantSetup((prev) => ({ ...prev, customName: name }));
  };

  const goToStep = (step: SetupStep) => {
    setAssistantSetup((prev) => ({
      ...prev,
      currentStep: step,
      selectedOption: null,
      isCustomName: false,
      customName: "",
      selectedName:
        step === "name" || step === "final" ? prev.selectedName : "",
    }));
    setMessages((prev) =>
      prev.filter((msg) => {
        if (!msg.step) return true;

        return stepOrder.indexOf(msg.step) <= stepOrder.indexOf(step);
      })
    );
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        assistantSettings,
        addMessage,
        clearMessages,
        updateAssistantSettings,
        assistantSetup,
        handleOptionSelect,
        handleValidateChoice,
        handleValidateCustomName,
        resetAssistantSetup,
        setCustomName,
        goToStep,
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
