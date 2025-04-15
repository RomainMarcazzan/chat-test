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

type SetupStep = "mode" | "gender" | "tone" | "name";

export default function InitChatScreen() {
  const { assistantSettings, updateAssistantSettings } = useChatContext();
  const [currentStep, setCurrentStep] = useState<SetupStep>("mode");
  const [customName, setCustomName] = useState("");
  const [isCustomName, setIsCustomName] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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
      } else {
        setIsCustomName(true);
      }
      return;
    }

    updateAssistantSettings({ [currentStep]: value });

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
      setIsCustomName(false);
      setCustomName("");
    }
  };

  const handlePresentModalPress = useCallback(() => {
    console.log("Presenting modal");

    bottomSheetModalRef.current?.present();
    setCurrentStep("mode");
  }, []);

  const renderStepContent = useMemo(() => {
    if (currentStep === "name" && isCustomName) {
      return (
        <View
          style={{
            padding: 16,
            borderWidth: 2,
            borderColor: "red",
          }}
        >
          {Platform.OS === "ios" ? (
            <BottomSheetTextInput
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
          ) : (
            <TextInput
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
          )}
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
    );
  }, [currentStep, isCustomName, customName]);

  return (
    <View style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1, padding: 20 }}>
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
      <BottomSheetModal ref={bottomSheetModalRef} handleComponent={null}>
        <BottomSheetScrollView>{renderStepContent}</BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
}
