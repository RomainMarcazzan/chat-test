import { Stack } from "expo-router";
import { ChatProvider } from "@/contexts/ChatContext";

export default function ChatLayout() {
  return (
    <ChatProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Assistant Personnel",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="main-chat"
          options={{
            title: "Assistant Personnel",
            headerShown: true,
            animation: "none",
          }}
        />
      </Stack>
    </ChatProvider>
  );
}
