import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { Platform, TextInput, TouchableOpacity, View } from "react-native";
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
  } = useChatContext();

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

  const stepOrder: SetupStep[] = ["mode", "gender", "tone", "name", "final"];

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
  }, [currentStep, assistantSettings, setSelectedOption]);

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

  return (
    <>
      <ThemedView style={{ flex: 1, padding: 16 }}>
        {/* Progress Bar */}
        <ProgressBar
          step={stepOrder.indexOf(currentStep)}
          total={stepOrder.length}
        />
        <View style={{ flex: 1, gap: 16 }}>
          {/* Mode */}
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
          {/* Genre */}
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
          <TouchableOpacity onPress={() => handleChangeStep("gender")}>
            <ThemedText style={{ color: "#0a7ea4", marginBottom: 4 }}>
              Changer ma réponse
            </ThemedText>
          </TouchableOpacity>
          {/* Ton */}
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
          <TouchableOpacity onPress={() => handleChangeStep("tone")}>
            <ThemedText style={{ color: "#0a7ea4", marginBottom: 4 }}>
              Changer ma réponse
            </ThemedText>
          </TouchableOpacity>
          {/* Nom */}
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
          <TouchableOpacity onPress={() => handleChangeStep("name")}>
            <ThemedText style={{ color: "#0a7ea4", marginBottom: 4 }}>
              Changer ma réponse
            </ThemedText>
          </TouchableOpacity>
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
