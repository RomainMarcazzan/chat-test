import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "secondary";
}

export function CustomButton({
  title,
  onPress,
  disabled = false,
  isLoading = false,
  variant = "primary",
}: CustomButtonProps) {
  const backgroundColor = useThemeColor(
    {},
    disabled ? "icon" : variant === "primary" ? "tint" : "background"
  );
  const textColor = useThemeColor(
    {},
    variant === "primary" ? "background" : "text"
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        { backgroundColor },
        variant === "secondary" && styles.secondaryButton,
        disabled && styles.disabledButton,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <ThemedText
          style={[
            styles.text,
            { color: textColor },
            disabled && styles.disabledText,
          ]}
        >
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.8,
  },
});
