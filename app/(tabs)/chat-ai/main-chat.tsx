import { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { CustomButton } from "@/components/ui/CustomButton";
import { useChatContext } from "@/contexts/ChatContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MainChatMessage } from "@/components/chat/MainChatMessage";
import { HeaderSettingsButton } from "@/components/chat/HeaderSettingsButton";

export default function MainChatScreen() {
  const { messages, addMessage } = useChatContext();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, "background");

  const handleSend = useCallback(() => {
    if (inputText.trim()) {
      addMessage(inputText.trim(), "user");
      setInputText("");
      setIsLoading(true);

      setTimeout(() => {
        addMessage("Exemple de message de l'IA", "assistant");
        setIsLoading(false);
      }, 1000);
    }
  }, [inputText, addMessage]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ThemedView style={styles.flex}>
        <HeaderSettingsButton />
        <ScrollView
          ref={scrollViewRef}
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
        >
          {messages.map((message) => (
            <MainChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <ThemedView style={styles.loadingMessage}>
              <ActivityIndicator size="small" />
            </ThemedView>
          )}
        </ScrollView>

        <ThemedView
          style={[
            styles.inputContainer,
            { backgroundColor, paddingBottom: insets.bottom || 16 },
          ]}
        >
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Écrivez un message..."
                placeholderTextColor="#00000050"
                multiline
                editable={!isLoading}
              />
            </View>
            <CustomButton
              title="Envoyer"
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

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  loadingMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#00000010",
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: "#00000020",
    padding: 16,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-end",
  },
  inputWrapper: {
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
