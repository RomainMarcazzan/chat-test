import { Stack } from "expo-router";
import { ChatProvider } from "@/contexts/ChatContext";

export default function ChatLayout() {
  return (
    <ChatProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Chat AI",
            headerShown: true,
          }}
        />
      </Stack>
    </ChatProvider>
  );
}
