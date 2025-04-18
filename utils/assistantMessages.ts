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
};

export const assistantMessages: Record<SetupStep, MessageConfig[]> = {
  mode: [
    {
      content: ({ userName }) =>
        `Bonjour ${userName} ! Bravo ! Votre compte a bien été créé.`,
      role: "assistant",
    },
    {
      content: () =>
        "Je serai votre assistant personnel. Mon rôle est de vous aider à collecter et organiser vos souvenirs comme jamais auparavant.",
      role: "assistant",
    },
    {
      content: () =>
        "Vous pouvez choisir ma personnalité, ce qui me permettra de vous aider au mieux tout en rendant votre expérience authentique et agréable.",
      role: "assistant",
    },
    {
      content: () => "Que voulez-vous faire ?",
      role: "assistant",
    },
  ],
  gender: [
    {
      content: ({ assistantSettings }) =>
        assistantSettings.mode === "default" ? "Par défaut" : "Personnalisé",
      role: "user",
    },
    {
      content: () => "D'abord, choisissez votre genre.",
      role: "assistant",
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
    },
    {
      content: () =>
        "Maintenant, quelle tonalité préférez-vous pour nos échanges?",
      role: "assistant",
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
    },
    {
      content: () =>
        "Parfait ! Il ne reste plus qu'à me choisir un nom. Comme ma fonction est la Sauvegarde et l'Archivage de la Mémoire, on m'a temporairement baptisée Sam.",
      role: "assistant",
    },
    {
      content: () => "Souhaitez-vous changer mon nom ?",
      role: "assistant",
    },
  ],
  final: [
    {
      content: ({ selectedOption, customName, assistantSettings }) =>
        selectedOption === "custom"
          ? customName
          : assistantSettings.name + " me convient",
      role: "user",
    },
    {
      content: ({ selectedOption, customName, assistantSettings, userName }) =>
        `Mon nom est donc: ${
          selectedOption === "custom" ? customName : assistantSettings.name
        }.${"\n"}Enchanté ${userName} !`,
      role: "assistant",
    },
  ],
};
