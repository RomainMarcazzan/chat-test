import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BottomSheet } from "@/components/BottomSheet";
import { router } from "expo-router";
import { Button, TouchableOpacity, View, TextInput } from "react-native";
import { useRef, useState } from "react";
import { useChatContext } from "@/contexts/ChatContext";

type SetupStep = "mode" | "gender" | "tone" | "name";

export default function InitChatScreen() {
  const { assistantSettings, updateAssistantSettings } = useChatContext();
  const [currentStep, setCurrentStep] = useState<SetupStep>("mode");
  const [customName, setCustomName] = useState("");
  const [isCustomName, setIsCustomName] = useState(false);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const bottomSheetRef = useRef(null);

  const getSnapPoints = () => {
    if (currentStep === "name" && isCustomName) {
      return ["75%"]; // More space for name input
    } else if (currentStep === "mode") {
      return ["35%"]; // Less space for simple options
    } else {
      return ["50%"]; // Medium space for other options
    }
  };

  const stepOptions = {
    mode: [
      { label: "Garder l'assistant par défaut", value: "default" },
      { label: "Personnaliser", value: "personalized" },
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
    if (currentStep === "name") {
      if (value === "default") {
        updateAssistantSettings({ name: "Sam" });
        setIsBottomSheetVisible(false);
      } else {
        setIsCustomName(true);
      }
      return;
    }

    updateAssistantSettings({ [currentStep]: value });

    if (currentStep === "mode" && value === "default") {
      setIsBottomSheetVisible(false);
      return;
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
    }
  };

  const handleCustomNameSubmit = () => {
    if (customName.trim()) {
      updateAssistantSettings({ name: customName.trim() });
      setIsBottomSheetVisible(false);
      setIsCustomName(false);
      setCustomName("");
    }
  };

  const renderStepContent = () => {
    if (currentStep === "name" && isCustomName) {
      return (
        <View style={{ padding: 16, width: "100%" }}>
          <ThemedText type="title">Choisissez un nom</ThemedText>
          <TextInput
            style={{
              width: "100%",
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
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginTop: 16,
            }}
          >
            <Button title="Retour" onPress={() => setIsCustomName(false)} />
            <Button
              title="Valider"
              onPress={handleCustomNameSubmit}
              disabled={!customName.trim()}
            />
          </View>
        </View>
      );
    }

    return (
      <>
        <ThemedText type="title">{stepTitles[currentStep]}</ThemedText>
        <View style={{ marginTop: 20, gap: 12, paddingBottom: 40 }}>
          {stepOptions[currentStep].map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                {
                  padding: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#ccc",
                },
                assistantSettings[currentStep] === option.value && {
                  backgroundColor: "#0a7ea4",
                },
              ]}
              onPress={() => handleOptionSelect(option.value)}
            >
              <ThemedText>{option.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  };

  return (
    <ThemedView
      style={{ flex: 1, padding: 20, borderWidth: 2, borderColor: "red" }}
    >
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
          onPress={() => {
            setCurrentStep("mode");
            setIsBottomSheetVisible(true);
          }}
        />
        <Button
          title="Commencer la discussion"
          onPress={() => {
            router.navigate("/chat-ai/main-chat");
          }}
        />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        visible={isBottomSheetVisible}
        snapPoints={getSnapPoints()}
        index={0}
        onChange={(index) => {
          if (index === -1) {
            setIsBottomSheetVisible(false);
          }
        }}
      >
        {renderStepContent()}
      </BottomSheet>
    </ThemedView>
  );
}
