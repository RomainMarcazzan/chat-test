import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

export function HeaderSettingsButton() {
  return (
    <View style={{ alignSelf: "flex-end", margin: 8 }}>
      <TouchableOpacity
        onPress={() => router.replace("/(tabs)/chat-ai")}
        accessibilityLabel="Paramètres de l'assistant"
      >
        <AntDesign name="setting" size={24} color="#0a7ea4" />
      </TouchableOpacity>
    </View>
  );
}
