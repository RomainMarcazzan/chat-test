import React from "react";
import { View, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useUser } from "@/contexts/UserContext";
import { Message } from "@/contexts/ChatContext";
import { Video } from "expo-av";

export type MainChatMessageProps = {
  message: Message;
};

export function MainChatMessage({ message }: MainChatMessageProps) {
  const { userPhoto } = useUser();
  const isAssistant = message.role === "assistant";
  const isUser = message.role === "user";
  const showProfileIcon = isUser ? userPhoto : isAssistant;

  return (
    <View>
      <View
        style={{
          flexDirection: isUser ? "row-reverse" : "row",
          alignItems: "center",
          marginVertical: 6,
        }}
      >
        {showProfileIcon ? (
          <View
            style={{
              borderRadius: 20,
              padding: 10,
              backgroundColor: isUser ? "#e6f0ff" : "#f0f0f0",
            }}
          >
            <View
              style={{
                alignItems: isUser ? "flex-end" : "flex-start",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#0a7ea4",
                borderRadius: 4,
                overflow: "hidden",
                width: 20,
                height: 20,
              }}
            >
              {isUser && userPhoto ? (
                <Image
                  source={{ uri: userPhoto }}
                  style={{ width: 32, height: 32, borderRadius: 4 }}
                />
              ) : (
                <AntDesign
                  name="user"
                  size={16}
                  color="#0a7ea4"
                  style={{ alignSelf: "center" }}
                />
              )}
            </View>
          </View>
        ) : (
          <View style={{ width: isUser ? 0 : 40 }} />
        )}
        <View
          style={{
            flex: 1,
            alignItems: isUser ? "flex-end" : "flex-start",
          }}
        >
          <View
            style={{
              padding: 8,
              marginLeft: isUser ? 0 : 4,
              marginRight: isUser ? 4 : 0,
            }}
          >
            <View
              style={{
                backgroundColor: isUser ? "#e6f0ff" : "#f0f0f0",
                padding: 10,
                position: "relative",
                borderRadius: 10,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              {message.videoUri ? (
                <Video
                  source={{ uri: message.videoUri }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode={"contain" as any}
                  shouldPlay={false}
                  useNativeControls
                  style={{
                    width: 220,
                    height: 160,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                />
              ) : null}
              <ThemedText>{message.content}</ThemedText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
