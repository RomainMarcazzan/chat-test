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
import { IconButton } from "@/components/ui/CustomButton";
import { useChatContext } from "@/contexts/ChatContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MainChatMessage } from "@/components/chat/MainChatMessage";
import { HeaderSettingsButton } from "@/components/chat/HeaderSettingsButton";
import { useUser } from "@/contexts/UserContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";

export default function MainChatScreen() {
  const { messages, addMessage } = useChatContext();
  const { pickVideo } = useUser();
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

  const handlePickVideo = async () => {
    const uri = await pickVideo();
    if (uri) {
      addMessage("Vidéo envoyée", "user", undefined, false, uri);
    }
  };

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
            <ThemedView
              style={[
                styles.loadingMessage,
                { backgroundColor: Colors.light.lightGrey },
              ]}
            >
              <ActivityIndicator size="small" />
            </ThemedView>
          )}
        </ScrollView>

        <ThemedView
          style={[
            styles.inputContainer,
            {
              backgroundColor,
              paddingBottom: insets.bottom || 16,
              borderColor: Colors.light.lightGrey,
            },
          ]}
        >
          <View style={styles.inputRow}>
            <IconButton
              onPress={handlePickVideo}
              icon={<AntDesign name="videocamera" size={24} color="#0a7ea4" />}
              style={{ paddingHorizontal: 4 }}
              disabled={isLoading}
            />
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Écrivez un message..."
              placeholderTextColor={Colors.light.tabIconDefault}
              multiline
              editable={!isLoading}
            />
            <IconButton
              onPress={handleSend}
              icon={<MaterialIcons name="send" size={24} color="#0a7ea4" />}
              style={{ paddingHorizontal: 4 }}
              disabled={!inputText.trim() || isLoading}
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
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  inputContainer: {
    borderTopWidth: 1,
    padding: 16,
  },
  inputRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
