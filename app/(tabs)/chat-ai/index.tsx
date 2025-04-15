import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import {
  Button,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { useChatContext } from "@/contexts/ChatContext";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SetupStep = "mode" | "gender" | "tone" | "name";

export default function InitChatScreen() {
  const { assistantSettings, updateAssistantSettings } = useChatContext();
  const [currentStep, setCurrentStep] = useState<SetupStep>("mode");
  const [customName, setCustomName] = useState("");
  const [isCustomName, setIsCustomName] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isNameValidated, setIsNameValidated] = useState(false);
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
  };

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
  };

  const handleValidateChoice = () => {
    if (!selectedOption) return;

    if (currentStep === "name") {
      if (selectedOption === "default") {
        setSelectedName("Sam");
        setIsNameValidated(true);
      } else {
        setIsCustomName(true);
      }
      return;
    }

    updateAssistantSettings({ [currentStep]: selectedOption });

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
    }
    setSelectedOption(null);
  };

  const handleValidateCustomName = () => {
    if (customName.trim()) {
      setSelectedName(customName.trim());
      setIsNameValidated(true);
    }
  };

  const handleCustomNameSubmit = () => {
    if (selectedName) {
      updateAssistantSettings({ name: selectedName });
      setIsCustomName(false);
      setIsNameValidated(false);
      setCustomName("");
      setSelectedName("");
      bottomSheetModalRef.current?.dismiss();
      router.navigate("/chat-ai/main-chat");
    }
  };

  const handlePresentModalPress = useCallback(() => {
    console.log("Presenting modal");

    bottomSheetModalRef.current?.present();
    setCurrentStep("mode");
  }, []);

  const AdaptiveTextInput = (props: any) =>
    Platform.OS === "ios" ? (
      <BottomSheetTextInput {...props} />
    ) : (
      <TextInput {...props} />
    );

  const renderStepContent = useMemo(() => {
    if (currentStep === "name" && (isCustomName || isNameValidated)) {
      if (isNameValidated) {
        return (
          <View
            style={{
              padding: 16,
              borderWidth: 2,
              borderColor: "red",
            }}
          >
            <ThemedText type="title">Nom choisi : {selectedName}</ThemedText>
            <View
              style={{
                marginTop: 16,
              }}
            >
              <Button
                title="Ok ! Continuons"
                onPress={handleCustomNameSubmit}
              />
            </View>
          </View>
        );
      }

      return (
        <View
          style={{
            padding: 16,
            borderWidth: 2,
            borderColor: "red",
          }}
        >
          <ThemedText type="title">Choisissez un nom</ThemedText>
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
          <View
            style={{
              marginTop: 16,
            }}
          >
            <Button
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
          borderWidth: 2,
          borderColor: "green",
        }}
      >
        <ThemedText type="title">{stepTitles[currentStep]}</ThemedText>
        {stepOptions[currentStep].map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              {
                padding: 16,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#ccc",
                marginTop: 8,
              },
              selectedOption === option.value && {
                backgroundColor: "#0a7ea4",
              },
            ]}
            onPress={() => handleOptionSelect(option.value)}
          >
            <ThemedText>{option.label}</ThemedText>
          </TouchableOpacity>
        ))}
        <View style={{ marginTop: 16 }}>
          <Button
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
    isNameValidated,
    customName,
    selectedOption,
    selectedName,
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

        <View style={{ gap: 16, marginBottom: 20 }}>
          <Button
            title="Modifier les paramètres"
            onPress={handlePresentModalPress}
          />
          <Button
            title="Commencer la discussion"
            onPress={() => {
              router.navigate("/chat-ai/main-chat");
            }}
          />
        </View>
      </ThemedView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        handleComponent={null}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
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
