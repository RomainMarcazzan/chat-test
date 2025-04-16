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

type SetupStep = "mode" | "gender" | "tone" | "name" | "final";

type ChatContextType = {
  messages: Message[];
  assistantSettings: AssistantSettings;
  addMessage: (content: string, role: Message["role"]) => void;
  clearMessages: () => void;
  updateAssistantSettings: (settings: Partial<AssistantSettings>) => void;
  currentStep: SetupStep;
  setCurrentStep: React.Dispatch<React.SetStateAction<SetupStep>>;
  selectedOption: string | null;
  setSelectedOption: React.Dispatch<React.SetStateAction<string | null>>;
  isCustomName: boolean;
  setIsCustomName: React.Dispatch<React.SetStateAction<boolean>>;
  customName: string;
  setCustomName: React.Dispatch<React.SetStateAction<string>>;
  selectedName: string;
  setSelectedName: React.Dispatch<React.SetStateAction<string>>;
  handleOptionSelect: (value: string) => void;
  handleValidateChoice: () => void;
  handleValidateCustomName: () => void;
  handleCustomNameSubmit: () => void;
  resetAssistantSetup: () => void;
  isEditingSingleParam: boolean;
  setIsEditingSingleParam: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultAssistantSettings: AssistantSettings = {
  mode: "personalized",
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

  const [currentStep, setCurrentStep] = useState<SetupStep>("mode");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCustomName, setIsCustomName] = useState(false);
  const [customName, setCustomName] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [isEditingSingleParam, setIsEditingSingleParam] = useState(false);

  const addMessage = (content: string, role: Message["role"]) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
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
    setAssistantSettings((prev) => {
      const updated = { ...prev, ...settings };
      console.log("Assistant settings updated:", {
        updated,
        isEditingSingleParam,
      });
      return updated;
    });
  };

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
  };

  const handleValidateChoice = () => {
    if (!selectedOption) return;
    if (currentStep === "mode" && selectedOption === "default") {
      updateAssistantSettings({
        mode: "default",
        gender: "neutral",
        tone: "cordial",
        name: "Sam",
      });
      setCurrentStep("final");
      setSelectedOption(null);
      return;
    }
    if (currentStep === "name") {
      if (selectedOption === "default") {
        setSelectedName("Sam");
        updateAssistantSettings({ name: "Sam" });
        if (isEditingSingleParam) {
          setIsEditingSingleParam(false);
          setSelectedOption(null);
          return;
        }
      } else {
        setIsCustomName(true);
        // Do NOT close the bottom sheet yet, wait for custom name validation
        return;
      }
    } else {
      updateAssistantSettings({ [currentStep]: selectedOption } as any);
      if (isEditingSingleParam) {
        setIsEditingSingleParam(false);
        setSelectedOption(null);
        return;
      }
    }
    switch (currentStep) {
      case "mode":
        setCurrentStep("gender");
        break;
      case "gender":
        setCurrentStep("tone");
        break;
      case "tone":
        setCurrentStep("name");
        break;
      case "name":
        setCurrentStep("final");
        break;
    }
    setSelectedOption(null);
  };

  const handleValidateCustomName = () => {
    if (customName.trim()) {
      const name = customName.trim();
      setSelectedName(name);
      updateAssistantSettings({ name });
      if (isEditingSingleParam) {
        setIsEditingSingleParam(false);
        setIsCustomName(false);
        return;
      }
      setCurrentStep("final");
      setIsCustomName(false);
    }
  };

  const handleCustomNameSubmit = () => {
    if (selectedName) {
      updateAssistantSettings({ name: selectedName });
      setIsCustomName(false);
      setCustomName("");
      setSelectedName("");
    }
  };

  const resetAssistantSetup = () => {
    setCurrentStep("mode");
    setSelectedOption(null);
    setIsCustomName(false);
    setCustomName("");
    setSelectedName("");
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        assistantSettings,
        addMessage,
        clearMessages,
        updateAssistantSettings,
        currentStep,
        setCurrentStep,
        selectedOption,
        setSelectedOption,
        isCustomName,
        setIsCustomName,
        customName,
        setCustomName,
        selectedName,
        setSelectedName,
        handleOptionSelect,
        handleValidateChoice,
        handleValidateCustomName,
        handleCustomNameSubmit,
        resetAssistantSetup,
        isEditingSingleParam,
        setIsEditingSingleParam,
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
