import { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CustomButton } from "@/components/ui/CustomButton";
import { useChatContext } from "@/contexts/ChatContext";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function MainChatScreen() {
  const { messages, addMessage, assistantSettings } = useChatContext();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, "background");

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSend = useCallback(() => {
    if (inputText.trim()) {
      // Add user message
      addMessage(inputText.trim(), "user");
      setInputText("");
      setIsLoading(true);

      // Simulate AI response
      setTimeout(() => {
        addMessage("This is a simulated response", "assistant");
        setIsLoading(false);
      }, 1000);
    }
  }, [inputText, addMessage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ThemedView style={{ flex: 1 }}>
        {/* Assistant settings summary */}
        <ThemedView
          style={{
            padding: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#eee",
          }}
        >
          <ThemedText type="subtitle">Assistant Settings</ThemedText>
          <ThemedText>
            Mode:{" "}
            {assistantSettings.mode === "default"
              ? "Par défaut"
              : "Personnalisé"}
          </ThemedText>
          <ThemedText>Genre: {assistantSettings.gender}</ThemedText>
          <ThemedText>Ton: {assistantSettings.tone}</ThemedText>
          <ThemedText>Nom: {assistantSettings.name}</ThemedText>
        </ThemedView>
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, gap: 12 }}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={{
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
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
                <ThemedText
                  style={{
                    fontSize: 12,
                    opacity: 0.5,
                    marginTop: 4,
                    textAlign: message.role === "user" ? "right" : "left",
                  }}
                >
                  {formatTimestamp(message.timestamp)}
                </ThemedText>
              </ThemedView>
            </View>
          ))}
          {isLoading && (
            <ThemedView
              style={{
                alignSelf: "flex-start",
                backgroundColor: "#00000010",
                padding: 12,
                borderRadius: 16,
                borderBottomLeftRadius: 4,
              }}
            >
              <ActivityIndicator size="small" />
            </ThemedView>
          )}
        </ScrollView>

        <ThemedView
          style={{
            borderTopWidth: 1,
            borderTopColor: "#00000020",
            padding: 16,
            paddingBottom: insets.bottom || 16,
            backgroundColor,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "flex-end",
            }}
          >
            <View style={{ flex: 1 }}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#00000020",
                  borderRadius: 20,
                  padding: 12,
                  paddingTop: 12,
                  fontSize: 16,
                  maxHeight: 120,
                  color: "#000000",
                }}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor="#00000050"
                multiline
                editable={!isLoading}
              />
            </View>
            <CustomButton
              title="Send"
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
              isLoading={isLoading}
            />
          </View>
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
