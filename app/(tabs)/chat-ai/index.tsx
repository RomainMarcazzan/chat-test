import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import {
  Keyboard,
  Platform,
  ScrollView,
  TextInput,
  View,
  StyleSheet,
  Pressable,
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
import { useUser } from "@/contexts/UserContext";
import { InitChatMessage } from "@/components/chat/InitChatMessage";

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
  const { userName } = useUser();

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
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [currentStep]);

  const renderStepContent = useMemo(() => {
    if (currentStep === "final") {
      return (
        <View style={styles.sheetContainer}>
          <View style={styles.sheetButtonContainer}>
            <CustomButton
              title="Ok ! Continuons"
              onPress={() => {
                bottomSheetModalRef.current?.dismiss();
                resetAssistantSetup();
                clearMessages();
                router.replace("/chat-ai/main-chat");
              }}
            />
          </View>
        </View>
      );
    }
    if (currentStep === "name" && isCustomName) {
      return (
        <View style={styles.sheetContainer}>
          <AdaptiveTextInput
            autoFocus
            style={styles.customNameInput}
            value={customName}
            onChangeText={(text: string) => setCustomName(text)}
            placeholder="Entrez un nom"
            placeholderTextColor="#999"
          />
          <View style={styles.sheetButtonContainer}>
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
      <View style={styles.sheetContainer}>
        {stepOptions[currentStep]?.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.optionButton,
              selectedOption === option.value && styles.optionButtonSelected,
            ]}
            onPress={() => handleOptionSelect(option.value)}
          >
            <View
              style={[
                styles.optionRadio,
                selectedOption === option.value && styles.optionRadioSelected,
              ]}
            >
              {selectedOption === option.value && (
                <AntDesign name="check" size={14} color="#fff" />
              )}
            </View>
            <ThemedText
              style={
                selectedOption === option.value
                  ? styles.optionTextSelected
                  : undefined
              }
            >
              {option.label}
            </ThemedText>
          </Pressable>
        ))}
        <View style={styles.sheetButtonContainer}>
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
    "*** Init Chat ***",
    JSON.stringify(
      {
        currentStep,
        isCustomName,
        customName,
        selectedName,
        assistantSettings,
      },
      null,
      2
    )
  );

  return (
    <>
      <ThemedView style={styles.container}>
        <ProgressBar
          step={stepOrder.indexOf(currentStep)}
          total={stepOrder.length}
        />
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <InitChatMessage
              key={message.id}
              message={message}
              goToStep={goToStep}
            />
          ))}

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
          <View
            style={
              Platform.OS === "ios" ? styles.iosSpacer : styles.androidSpacer
            }
          />
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
            <View style={styles.sheetContainer}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  sheetContainer: {
    padding: 16,
  },
  sheetButtonContainer: {
    marginTop: 16,
  },
  customNameInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 16,
    color: "#000",
  },
  optionButton: {
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionButtonSelected: {
    backgroundColor: "#0a7ea4",
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  optionRadioSelected: {
    borderColor: "#fff",
  },
  optionTextSelected: {
    color: "#fff",
  },
  iosSpacer: {
    height: 400,
  },
  androidSpacer: {
    height: 200,
  },
});
