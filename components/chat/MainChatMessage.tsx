import React from "react";
import { View, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useUser } from "@/contexts/UserContext";
import { Message } from "@/contexts/ChatContext";
import { useVideoPlayer, VideoView } from "expo-video";

export type MainChatMessageProps = {
  message: Message;
};

export function MainChatMessage({ message }: MainChatMessageProps) {
  const { userPhoto } = useUser();
  const isAssistant = message.role === "assistant";
  const isUser = message.role === "user";
  const showProfileIcon = isUser ? userPhoto : isAssistant;
  const player = useVideoPlayer(message.videoUri || null);

  return (
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
            borderRadius: 15,
            backgroundColor: isUser ? "#e6f0ff" : "#f0f0f0",
          }}
        >
          {isUser && userPhoto ? (
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                overflow: "hidden",
              }}
            >
              <Image
                source={{ uri: userPhoto }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </View>
          ) : (
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#0a7ea4",
                  overflow: "hidden",
                  borderRadius: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 2,
                }}
              >
                <AntDesign
                  name="user"
                  size={12}
                  color="#0a7ea4"
                  style={{ alignSelf: "center" }}
                />
              </View>
            </View>
          )}
        </View>
      ) : (
        <View style={{ width: isUser ? 0 : 30 }} />
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
              borderBottomLeftRadius: isUser ? 10 : 0,
              borderBottomRightRadius: isUser ? 0 : 10,
            }}
          >
            {message.videoUri && player && isUser ? (
              <VideoView
                player={player}
                contentFit="contain"
                nativeControls
                style={{
                  width: 220,
                  height: 160,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              />
            ) : null}
            <ThemedText>{message.content}</ThemedText>
            {isAssistant && (
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: -9,
                  width: 0,
                  height: 0,
                  borderTopWidth: 10,
                  borderTopColor: "#f0f0f0",
                  borderRightWidth: 15,
                  borderRightColor: "transparent",
                  borderBottomWidth: 0,
                  borderLeftWidth: 0,
                }}
              />
            )}
            {isUser && (
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: -9,
                  width: 0,
                  height: 0,
                  borderTopWidth: 10,
                  borderTopColor: "#e6f0ff",
                  borderLeftWidth: 15,
                  borderLeftColor: "transparent",
                  borderBottomWidth: 0,
                  borderRightWidth: 0,
                }}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
