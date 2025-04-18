import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "default" | "outline" | "underline";
  style?: ViewStyle;
}

export function CustomButton({
  title,
  onPress,
  disabled = false,
  isLoading = false,
  variant = "default",
  style,
}: CustomButtonProps) {
  const isUnderline = variant === "underline";
  const backgroundColor = isUnderline
    ? "transparent"
    : useThemeColor(
        {},
        disabled ? "icon" : variant === "default" ? "tint" : "background"
      );
  const textColor = useThemeColor(
    {},
    variant === "default" ? "background" : "text"
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        { backgroundColor },
        variant === "outline" && styles.secondaryButton,
        isUnderline && styles.underlineButton,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <ThemedText
          style={[
            styles.text,
            { color: textColor },
            isUnderline && styles.underlineText,
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
  underlineButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: undefined,
    height: undefined,
    elevation: 0,
    shadowOpacity: 0,
  },
  underlineText: {
    textDecorationLine: "underline",
    fontWeight: "400",
    fontSize: 14, // smaller font size for underline variant
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});
