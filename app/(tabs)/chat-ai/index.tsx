import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import {
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRef, useMemo, useEffect } from "react";
import { useChatContext } from "@/contexts/ChatContext";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomButton } from "@/components/ui/CustomButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ToneOption, ToneSelection } from "@/components/chat/ToneSelection";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";

type SetupStep = "mode" | "gender" | "tone" | "name" | "final";

export default function InitChatScreen() {
  const {
    assistantSettings,
    currentStep,
    selectedOption,
    setSelectedOption,
    isCustomName,
    customName,
    setCustomName,
    selectedName,
    handleOptionSelect,
    handleValidateChoice,
    handleValidateCustomName,
    resetAssistantSetup,
    setCurrentStep,
    isEditingSingleParam,
    setIsEditingSingleParam,
    updateAssistantSettings,
    messages,
    addMessage,
    clearMessages,
  } = useChatContext();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const theme = useColorScheme() ?? "light";
  const scrollViewRef = useRef<ScrollView>(null);

  const stepOptions = {
    mode: [
      { label: "Personnaliser", value: "personalized" },
      { label: "Garder l'assistant par défaut", value: "default" },
    ],
    gender: [
      { label: "Féminin", value: "feminine" },
      { label: "Masculin", value: "masculine" },
      { label: "Neutre", value: "neutral" },
    ],
    tone: [
      {
        label: "Formelle",
        value: "formal",
        description:
          "Une assistante personnelle, toujours prête à vous aider avec discrétion et efficacité.",
        message:
          "Je suis à votre disposition pour vous fournir toute information ou assistance dont vous pouriez avoir besoin. N'hésitez pas à me solliciter",
      },
      {
        label: "Cordiale",
        value: "cordial",
        description: "Un ton amical et chaleureux, mais respectueux.",
        message:
          "Je suis à votre disposition pour vous fournir toute information ou assistance dont vous pouriez avoir besoin. N'hésitez pas à me solliciter",
      },
      {
        label: "Humoristique",
        value: "humorous",
        description: "Un ton léger, avec une touche d'humour.",
        message:
          "Je suis à votre disposition pour vous fournir toute information ou assistance dont vous pouriez avoir besoin. N'hésitez pas à me solliciter",
      },
    ] as ToneOption[],
    name: [
      { label: "Sam me convient", value: "default" },
      { label: "Je veux choisir un autre nom", value: "custom" },
    ],
  };

  const stepOrder: SetupStep[] = ["mode", "gender", "tone", "name", "final"];

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const AdaptiveTextInput = (props: any) =>
    Platform.OS === "ios" ? (
      <BottomSheetTextInput {...props} />
    ) : (
      <TextInput {...props} />
    );

  useEffect(() => {
    if (currentStep === "mode") {
      setSelectedOption(assistantSettings.mode);
    } else if (currentStep === "gender") {
      setSelectedOption(assistantSettings.gender);
    } else if (currentStep === "tone") {
      setSelectedOption(assistantSettings.tone);
    } else if (currentStep === "name") {
      setSelectedOption(
        assistantSettings.name === "Sam" ? "default" : "custom"
      );
    }
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [currentStep, assistantSettings, setSelectedOption]);

  const userName = "Romain";

  const handlePresentModalPress = () => {
    resetAssistantSetup();
    setSelectedOption("personalized");
    setIsEditingSingleParam(false);
    bottomSheetModalRef.current?.present();
  };

  const handleChangeStep = (step: SetupStep) => {
    setCurrentStep(step);
    setIsEditingSingleParam(true);
    bottomSheetModalRef.current?.present();
  };

  useEffect(() => {
    if (currentStep === "mode") {
      clearMessages();
      addMessage(
        `Bonjour ${userName} ! Bravo ! Votre compte a bien été créé.`,
        "assistant",
        "mode"
      );
      addMessage(
        "Je serai votre assistant personnel. Mon rôle est de vous aider à collecter et organiser vos souvenirs comme jamais auparavant.",
        "assistant",
        "mode"
      );
      addMessage(
        "Vous pouvez choisir ma personnalité, ce qui me permettra de vous aider au mieux tout en rendant votre expérience authentique et agréable.",
        "assistant",
        "mode"
      );
      addMessage("Que voulez-vous faire ?", "assistant", "mode");
      handlePresentModalPress();
    }
    if (currentStep === "gender") {
      addMessage(
        `${
          assistantSettings.mode === "default" ? "Par défaut" : "Personnalisé"
        }`,
        "user",
        "mode"
      );
      addMessage("D'abord, choisissez votre genre.", "assistant", "gender");
    }
    if (currentStep === "tone") {
      addMessage(`${assistantSettings.gender}`, "user", "gender");
      addMessage(
        "Maintenant, quelle tonalité préférez-vous pour nos échanges?",
        "assistant",
        "tone"
      );
    }
    if (currentStep === "name") {
      addMessage(`${assistantSettings.tone}`, "user", "tone");
      addMessage(
        "Parfait ! Il ne reste plus qu'à me choisir un nom. Comme ma fonction est la Sauvegarde et l'Archivage de la Mémoire, on m'a temporairement baptisée Sam.",
        "assistant",
        "name"
      );
      addMessage("Souhaitez-vous changer mon nom ?", "assistant", "name");
    }
    if (currentStep === "final") {
      addMessage(
        `${
          selectedOption === "custom"
            ? customName
            : assistantSettings.name + " me convient"
        }`,
        "user",
        "name"
      );
      addMessage(
        `Mon nom est donc: ${
          selectedOption === "custom" ? customName : assistantSettings.name
        }.${"\n"}Enchanté ${userName} !`,
        "assistant",
        "final"
      );
    }
  }, [currentStep]);

  const renderStepContent = useMemo(() => {
    if (currentStep === "final") {
      return (
        <View style={{ padding: 16 }}>
          <View style={{ marginTop: 16 }}>
            <CustomButton
              title="Ok ! Continuons"
              onPress={() => {
                bottomSheetModalRef.current?.dismiss();
                resetAssistantSetup();
                router.navigate("/chat-ai/main-chat");
              }}
            />
          </View>
        </View>
      );
    }
    if (currentStep === "name" && isCustomName) {
      return (
        <View style={{ padding: 16 }}>
          <AdaptiveTextInput
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              marginTop: 16,
              color: "#000",
            }}
            value={customName}
            onChangeText={setCustomName}
            placeholder="Entrez un nom"
            placeholderTextColor="#999"
          />
          <View style={{ marginTop: 16 }}>
            <CustomButton
              title="Valider mon choix"
              onPress={() => {
                handleValidateCustomName();
                if (isEditingSingleParam) {
                  bottomSheetModalRef.current?.dismiss();
                }
              }}
              disabled={!customName.trim()}
            />
          </View>
        </View>
      );
    }
    return (
      <View style={{ padding: 16 }}>
        {stepOptions[currentStep]?.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              {
                padding: 8,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#ccc",
                marginTop: 8,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              },
              selectedOption === option.value && {
                backgroundColor: "#0a7ea4",
              },
            ]}
            onPress={() => handleOptionSelect(option.value)}
          >
            <View
              style={[
                {
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor:
                    selectedOption === option.value ? "#fff" : "#ccc",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              {selectedOption === option.value && (
                <AntDesign name="check" size={14} color="#fff" />
              )}
            </View>
            <ThemedText
              style={
                selectedOption === option.value ? { color: "#fff" } : undefined
              }
            >
              {option.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
        <View style={{ marginTop: 16 }}>
          <CustomButton
            title="Valider mon choix"
            onPress={() => {
              const wasCustomName =
                currentStep === "name" && selectedOption === "custom";
              handleValidateChoice();
              if (isEditingSingleParam && !wasCustomName) {
                bottomSheetModalRef.current?.dismiss();
              }
            }}
            disabled={!selectedOption}
          />
        </View>
      </View>
    );
  }, [
    currentStep,
    isCustomName,
    customName,
    selectedOption,
    selectedName,
    assistantSettings,
    isEditingSingleParam,
  ]);

  console.log(
    "*** Index ***",
    JSON.stringify(
      {
        stepOrder,
        isEditingSingleParam,
        currentStep,
        selectedOption,
        assistantSettings,
      },
      null,
      2
    )
  );

  return (
    <>
      <ThemedView style={{ flex: 1, padding: 16 }}>
        <ProgressBar
          step={stepOrder.indexOf(currentStep)}
          total={stepOrder.length}
        />
        <ScrollView ref={scrollViewRef} style={{ flex: 1, borderWidth: 1 }}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={{
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
                marginVertical: 4,
              }}
            >
              <ThemedView
                style={{
                  backgroundColor:
                    message.role === "user" ? "#007AFF20" : "#00000010",
                  padding: 12,
                  borderRadius: 16,
                  borderBottomRightRadius: message.role === "user" ? 4 : 16,
                  borderBottomLeftRadius: message.role === "assistant" ? 4 : 16,
                }}
              >
                <ThemedText>{message.content}</ThemedText>
                {message.role === "user" &&
                  ["gender", "tone", "name"].includes(message.step || "") && (
                    <TouchableOpacity
                      onPress={() =>
                        handleChangeStep(message.step as SetupStep)
                      }
                    >
                      <ThemedText style={{ color: "#0a7ea4", marginBottom: 4 }}>
                        Changer ma réponse
                      </ThemedText>
                    </TouchableOpacity>
                  )}
              </ThemedView>
            </View>
          ))}
          {currentStep === "tone" && (
            <ToneSelection
              toneOptions={stepOptions.tone}
              selectedTone={assistantSettings.tone}
              onSelect={(tone) => {
                setSelectedOption(tone);
                handleOptionSelect(tone);
                updateAssistantSettings({ tone });
              }}
            />
          )}
          <View style={{ height: 200 }} />
        </ScrollView>
      </ThemedView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        handleComponent={null}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        backgroundStyle={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          shadowColor: "#000",
          backgroundColor: Colors[theme].lightGrey,
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }}
        android_keyboardInputMode="adjustResize"
      >
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingBottom: insets.bottom,
          }}
        >
          {/* Only show options in bottom sheet if not tone step */}
          {currentStep === "tone" ? (
            <View style={{ padding: 16 }}>
              <CustomButton
                title="Valider mon choix"
                onPress={() => {
                  handleValidateChoice();
                  if (isEditingSingleParam) {
                    bottomSheetModalRef.current?.dismiss();
                  }
                }}
                disabled={!selectedOption}
              />
            </View>
          ) : (
            renderStepContent
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
}
