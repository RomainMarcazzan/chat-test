import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import {
  Keyboard,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Image,
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
import { assistantMessages } from "@/utils/assistantMessages";
import { useUser } from "@/contexts/UserPhotoContext";

type SetupStep = "mode" | "gender" | "tone" | "name" | "final";

const AdaptiveTextInput = (props: any) =>
  Platform.OS === "ios" ? (
    <BottomSheetTextInput {...props} />
  ) : (
    <TextInput {...props} />
  );

export default function InitChatScreen() {
  const {
    assistantSettings,
    assistantSetup,
    handleOptionSelect,
    handleValidateChoice,
    handleValidateCustomName,
    resetAssistantSetup,
    updateAssistantSettings,
    messages,
    addMessage,
    clearMessages,
    setCustomName,
    goToStep,
  } = useChatContext();

  const {
    currentStep,
    selectedOption,
    isCustomName,
    customName,
    selectedName,
  } = assistantSetup;

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const theme = useColorScheme() ?? "light";
  const scrollViewRef = useRef<ScrollView>(null);
  const { userPhoto, userName } = useUser();

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
        labelMasculine: "Formel",
        labelFeminine: "Formelle",
        value: "formal",
        descriptionMasculine:
          "Un assistant personnel, toujours prêt à vous aider avec discrétion et efficacité.",
        descriptionFeminine:
          "Une assistante personnelle, toujours prête à vous aider avec discrétion et efficacité.",
        message:
          "Je suis à votre disposition pour vous fournir toute information ou assistance dont vous pouriez avoir besoin. N'hésitez pas à me solliciter",
      },
      {
        label: "Cordiale",
        labelMasculine: "Cordial",
        labelFeminine: "Cordiale",
        value: "cordial",
        descriptionMasculine:
          "Un assistant personnel avec un ton amical et chaleureux, mais respectueux.",
        descriptionFeminine:
          "Une assistante personnelle avec un ton amicale et chaleureux, mais respectueux.",
        message:
          "Je suis à votre disposition pour vous fournir toute information ou assistance dont vous pouriez avoir besoin. N'hésitez pas à me solliciter",
      },
      {
        label: "Humoristique",
        labelMasculine: "Humoristique",
        labelFeminine: "Humoristique",
        value: "humorous",
        descriptionMasculine:
          "Un assistant personnel avec un ton léger et une touche d'humour.",
        descriptionFeminine:
          "Une assistante personnelle avec un ton léger et une touche d'humour.",
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

  const defaultOptions: Record<string, string | undefined> = {
    mode: "personalized",
    gender: "feminine",
    tone: "cordial",
    name: "default",
  };

  useEffect(() => {
    const getPreviousStep = (step: SetupStep): SetupStep | null => {
      const idx = stepOrder.indexOf(step);
      if (idx > 0) return stepOrder[idx - 1];
      return null;
    };

    const params = {
      userName,
      assistantSettings,
      selectedOption,
      customName,
    };

    if (currentStep === "mode") {
      clearMessages();
    }

    assistantMessages[currentStep]
      ?.filter((msg, idx) => {
        if (
          currentStep === "final" &&
          msg.role === "user" &&
          assistantSettings.mode === "default"
        ) {
          return false;
        }
        return true;
      })
      .forEach((msg) => {
        const stepForMessage =
          msg.role === "user"
            ? getPreviousStep(currentStep) ?? currentStep
            : currentStep;
        addMessage(
          msg.content(params),
          msg.role,
          stepForMessage,
          msg.isLastMessage
        );
      });

    if (currentStep in defaultOptions) {
      if (defaultOptions[currentStep]) {
        handleOptionSelect(defaultOptions[currentStep]!);
      }
      bottomSheetModalRef.current?.present();
    } else if (currentStep === "final") {
      bottomSheetModalRef.current?.present();
    }

    if (scrollViewRef.current) {
      console.log("scrollViewRef.current");
      scrollViewRef.current.scrollToEnd({ animated: true });
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
            autoFocus
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              marginTop: 16,
              color: "#000",
            }}
            value={customName}
            onChangeText={(text: string) => setCustomName(text)}
            placeholder="Entrez un nom"
            placeholderTextColor="#999"
          />
          <View style={{ marginTop: 16 }}>
            <CustomButton
              title="Valider mon choix"
              onPress={() => {
                Keyboard.dismiss();
                handleValidateCustomName();
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
              handleValidateChoice();
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
  ]);

  console.log(
    "*** Index ***",
    JSON.stringify(
      {
        stepOrder,
        assistantSettings,
        assistantSetup,
        messages,
      },
      null,
      2
    )
  );

  return (
    <>
      <ThemedView style={{ flex: 1, padding: 16 }}>
        {/* Removed the button to take/change photo */}
        <ProgressBar
          step={stepOrder.indexOf(currentStep)}
          total={stepOrder.length}
        />
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => {
            const isAssistant = message.role === "assistant";
            const isUser = message.role === "user";
            const showProfileIcon = message.isLastMessage;
            return (
              <View key={message.id}>
                <View
                  style={{
                    flexDirection: isUser ? "row-reverse" : "row",
                    alignItems: "center",
                    marginVertical: 6,
                  }}
                >
                  {showProfileIcon ? (
                    <View
                      style={{
                        borderRadius: 20,
                        padding: 10,
                        backgroundColor: isUser ? "#e6f0ff" : "#f0f0f0",
                      }}
                    >
                      <View
                        style={{
                          alignItems: isUser ? "flex-end" : "flex-start",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: "#0a7ea4",
                          borderRadius: 4,
                          overflow: "hidden",
                          width: 20,
                          height: 20,
                        }}
                      >
                        {isUser && userPhoto ? (
                          <Image
                            source={{ uri: userPhoto }}
                            style={{ width: 32, height: 32, borderRadius: 4 }}
                          />
                        ) : (
                          <AntDesign
                            name="user"
                            size={16}
                            color="#0a7ea4"
                            style={{ alignSelf: "center" }}
                          />
                        )}
                      </View>
                    </View>
                  ) : (
                    <View style={{ width: 35 }} />
                  )}
                  <View
                    style={{
                      flex: 1,
                      alignItems: isUser ? "flex-end" : "flex-start",
                    }}
                  >
                    <View
                      style={{
                        padding: 8,
                        marginLeft: isUser ? 0 : 4,
                        marginRight: isUser ? 4 : 0,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: isUser ? "#e6f0ff" : "#f0f0f0",
                          padding: 10,
                          position: "relative",
                          borderRadius: 10,
                          borderBottomLeftRadius: !message.isLastMessage
                            ? 10
                            : isUser
                            ? 10
                            : 0,
                          borderBottomRightRadius: !message.isLastMessage
                            ? 10
                            : isUser
                            ? 0
                            : 10,
                        }}
                      >
                        <ThemedText>{message.content}</ThemedText>
                        {message.isLastMessage && isAssistant && (
                          <View
                            style={{
                              position: "absolute",
                              left: 0,
                              bottom: -9,
                              width: 0,
                              height: 0,
                              borderTopWidth: 10,
                              borderTopColor: "#f0f0f0",
                              borderRightWidth: 15,
                              borderRightColor: "transparent",
                              borderBottomWidth: 0,
                              borderLeftWidth: 0,
                            }}
                          />
                        )}
                        {message.isLastMessage && isUser && (
                          <View
                            style={{
                              position: "absolute",
                              right: 0,
                              bottom: -9,
                              width: 0,
                              height: 0,
                              borderTopWidth: 10,
                              borderTopColor: "#e6f0ff",
                              borderLeftWidth: 15,
                              borderLeftColor: "transparent",
                              borderBottomWidth: 0,
                              borderRightWidth: 0,
                            }}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                </View>
                {/* CustomButton for user messages with step */}
                {isUser &&
                  (message.step === "gender" ||
                    message.step === "tone" ||
                    message.step === "name") && (
                    <CustomButton
                      title="Changer ma réponse"
                      variant="underline"
                      onPress={() => {
                        if (message.step) {
                          goToStep(message.step);
                        }
                      }}
                      style={{
                        alignSelf: "flex-end",
                      }}
                    />
                  )}
              </View>
            );
          })}

          {currentStep === "tone" && (
            <ToneSelection
              toneOptions={stepOptions.tone}
              selectedTone={assistantSettings.tone}
              onSelect={(tone) => {
                handleOptionSelect(tone);
                updateAssistantSettings({ tone });
              }}
              assistantGender={assistantSettings.gender}
            />
          )}
          <View style={{ height: Platform.OS === "ios" ? 400 : 200 }} />
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
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: insets.bottom,
          }}
        >
          {currentStep === "tone" ? (
            <View style={{ padding: 16 }}>
              <CustomButton
                title="Valider mon choix"
                onPress={() => {
                  handleValidateChoice();
                }}
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
