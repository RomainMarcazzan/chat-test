import React from "react";
import { View, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import AntDesign from "@expo/vector-icons/AntDesign";
import { CustomButton } from "@/components/ui/CustomButton";
import { useUser } from "@/contexts/UserPhotoContext";
import { Message, SetupStep } from "@/contexts/ChatContext";

export type InitChatMessageProps = {
  message: Message;
  goToStep: (step: SetupStep) => void;
};

export function InitChatMessage({ message, goToStep }: InitChatMessageProps) {
  const { userPhoto } = useUser();
  const isAssistant = message.role === "assistant";
  const isUser = message.role === "user";
  const showProfileIcon = isUser
    ? message.isLastMessage && userPhoto
    : message.isLastMessage && isAssistant;

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
                borderBottomLeftRadius: !message.isLastMessage
                  ? 10
                  : isUser
                  ? 10
                  : 0,
                borderBottomRightRadius: !message.isLastMessage
                  ? 10
                  : isUser
                  ? 0
                  : 10,
              }}
            >
              <ThemedText>{message.content}</ThemedText>
              {message.isLastMessage && isAssistant && (
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
              {message.isLastMessage && isUser && (
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
      {isUser &&
        (message.step === "gender" ||
          message.step === "tone" ||
          message.step === "name") && (
          <CustomButton
            title="Changer ma réponse"
            variant="underline"
            onPress={() => {
              if (message.step) {
                goToStep(message.step);
              }
            }}
            style={{ alignSelf: "flex-end" }}
          />
        )}
    </View>
  );
}
