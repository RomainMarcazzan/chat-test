// app/(tabs)/chat-ai/assistantMessages.ts
import { AssistantSettings } from "@/contexts/ChatContext";

type SetupStep = "mode" | "gender" | "tone" | "name" | "final";
type MessageRole = "assistant" | "user";

type MessageParams = {
  userName: string;
  assistantSettings: AssistantSettings;
  selectedOption: string | null;
  customName: string;
};

type MessageConfig = {
  content: (params: MessageParams) => string;
  role: MessageRole;
  isLastMessage?: boolean;
};

export const assistantMessages: Record<SetupStep, MessageConfig[]> = {
  mode: [
    {
      content: ({ userName }) =>
        `Bonjour ${userName} ! Bravo ! Votre compte a bien été créé.`,
      role: "assistant",
      isLastMessage: false,
    },
    {
      content: () =>
        "Je serai votre assistant personnel. Mon rôle est de vous aider à collecter et organiser vos souvenirs comme jamais auparavant.",
      role: "assistant",
      isLastMessage: false,
    },
    {
      content: () =>
        "Vous pouvez choisir ma personnalité, ce qui me permettra de vous aider au mieux tout en rendant votre expérience authentique et agréable.",
      role: "assistant",
      isLastMessage: false,
    },
    {
      content: () => "Que voulez-vous faire ?",
      role: "assistant",
      isLastMessage: true,
    },
  ],
  gender: [
    {
      content: ({ assistantSettings }) =>
        assistantSettings.mode === "default" ? "Par défaut" : "Personnalisé",
      role: "user",
      isLastMessage: true,
    },
    {
      content: () => "D'abord, choisissez votre genre.",
      role: "assistant",
      isLastMessage: true,
    },
  ],
  tone: [
    {
      content: ({ assistantSettings }) => {
        switch (assistantSettings.gender) {
          case "masculine":
            return "Masculin";
          case "feminine":
            return "Féminin";
          case "neutral":
            return "Neutre";
          default:
            return "";
        }
      },
      role: "user",
      isLastMessage: true,
    },
    {
      content: () =>
        "Maintenant, quelle tonalité préférez-vous pour nos échanges?",
      role: "assistant",
      isLastMessage: true,
    },
  ],
  name: [
    {
      content: ({ assistantSettings }) => {
        switch (assistantSettings.tone) {
          case "cordial":
            return assistantSettings.gender === "feminine"
              ? "Cordiale"
              : "Cordial";
          case "formal":
            return assistantSettings.gender === "feminine"
              ? "Formelle"
              : "Formel";
          case "humorous":
            return "Humoristique";
          default:
            return "";
        }
      },
      role: "user",
      isLastMessage: true,
    },
    {
      content: () =>
        "Parfait ! Il ne reste plus qu'à me choisir un nom. Comme ma fonction est la Sauvegarde et l'Archivage de la Mémoire, on m'a temporairement baptisée Sam.",
      role: "assistant",
      isLastMessage: false,
    },
    {
      content: () => "Souhaitez-vous changer mon nom ?",
      role: "assistant",
      isLastMessage: true,
    },
  ],
  final: [
    {
      content: ({ selectedOption, customName, assistantSettings }) =>
        selectedOption === "custom"
          ? customName
          : assistantSettings.name + " me convient",
      role: "user",
      isLastMessage: true,
    },
    {
      content: ({ selectedOption, customName, assistantSettings, userName }) =>
        `Mon nom est donc: ${
          selectedOption === "custom" ? customName : assistantSettings.name
        }.${"\n"}Enchanté ${userName} !`,
      role: "assistant",
      isLastMessage: true,
    },
  ],
};
