import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { Platform, TextInput, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useCallback, useMemo, useRef, useState } from "react";
import { useChatContext } from "@/contexts/ChatContext";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomButton } from "@/components/ui/CustomButton";

type SetupStep = "mode" | "gender" | "tone" | "name" | "final";

export default function InitChatScreen() {
  const { assistantSettings, updateAssistantSettings } = useChatContext();
  const [currentStep, setCurrentStep] = useState<SetupStep>("mode");
  const [customName, setCustomName] = useState("");
  const [isCustomName, setIsCustomName] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState("");
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

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
      { label: "Formelle", value: "formal" },
      { label: "Cordiale", value: "cordial" },
      { label: "Humoristique", value: "humorous" },
    ],
    name: [
      { label: "Sam me convient", value: "default" },
      { label: "Je veux choisir un autre nom", value: "custom" },
    ],
  };

  const stepTitles = {
    mode: "Mode de l'assistant",
    gender: "Genre de l'assistant",
    tone: "Ton de l'assistant",
    name: "Nom de l'assistant",
    final: "Confirmation",
  };

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
  };

  const handleValidateChoice = () => {
    if (!selectedOption) return;

    if (currentStep === "mode" && selectedOption === "default") {
      // If user chooses default mode, set all default values and go to final step
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
      } else {
        setIsCustomName(true);
        return;
      }
    } else {
      updateAssistantSettings({ [currentStep]: selectedOption });
    }

    // Move to next step
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
      bottomSheetModalRef.current?.dismiss();
      router.navigate("/chat-ai/main-chat");
    }
  };

  const handlePresentModalPress = useCallback(() => {
    console.log("Presenting modal");
    setCurrentStep("mode");
    setSelectedOption("personalized");
    bottomSheetModalRef.current?.present();
  }, []);

  const AdaptiveTextInput = (props: any) =>
    Platform.OS === "ios" ? (
      <BottomSheetTextInput {...props} />
    ) : (
      <TextInput {...props} />
    );

  const renderStepContent = useMemo(() => {
    if (currentStep === "final") {
      return (
        <View
          style={{
            padding: 16,
          }}
        >
          <View style={{ marginTop: 16 }}>
            <CustomButton
              title="Ok ! Continuons"
              onPress={() => {
                bottomSheetModalRef.current?.dismiss();
                router.navigate("/chat-ai/main-chat");
              }}
            />
          </View>
        </View>
      );
    }

    if (currentStep === "name" && isCustomName) {
      return (
        <View
          style={{
            padding: 16,
          }}
        >
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
              onPress={handleValidateCustomName}
              disabled={!customName.trim()}
            />
          </View>
        </View>
      );
    }

    return (
      <View
        style={{
          padding: 16,
        }}
      >
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
            onPress={handleValidateChoice}
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

  return (
    <>
      <ThemedView style={{ flex: 1, padding: 16 }}>
        <View style={{ flex: 1, gap: 16 }}>
          <ThemedText type="title">Paramètres de l'assistant</ThemedText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <ThemedText type="defaultSemiBold">Mode:</ThemedText>
            <ThemedText>
              {assistantSettings.mode === "default"
                ? "Par défaut"
                : "Personnalisé"}
            </ThemedText>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <ThemedText type="defaultSemiBold">Genre:</ThemedText>
            <ThemedText>{assistantSettings.gender}</ThemedText>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <ThemedText type="defaultSemiBold">Ton:</ThemedText>
            <ThemedText>{assistantSettings.tone}</ThemedText>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <ThemedText type="defaultSemiBold">Nom:</ThemedText>
            <ThemedText>{assistantSettings.name}</ThemedText>
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <CustomButton
            title="Modifier les paramètres"
            onPress={handlePresentModalPress}
            variant="secondary"
          />
        </View>
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
          {renderStepContent}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
}
