import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BottomSheet } from "@/components/BottomSheet";
import { router } from "expo-router";
import { Button } from "react-native";
import { useMemo, useState } from "react";

export default function InitChatScreen() {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText>Init Chat AI</ThemedText>
      <Button
        title="Start Chat"
        onPress={() => {
          router.navigate("/chat-ai/main-chat");
        }}
      />

      {isBottomSheetVisible && (
        <BottomSheet snapPoints={snapPoints}>
          <ThemedText type="title">Welcome to Chat AI</ThemedText>
          <ThemedText style={{ marginTop: 16 }}>
            This is an example of the bottom sheet in the initial screen. You
            can swipe it up and down to different positions.
          </ThemedText>
        </BottomSheet>
      )}
    </ThemedView>
  );
}
