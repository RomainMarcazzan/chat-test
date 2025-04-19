import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import { CustomButton } from "@/components/ui/CustomButton";
import { AntDesign } from "@expo/vector-icons";

interface CustomDialogProps {
  visible: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose?: () => void;
  confirmText?: string;
  cancelText?: string;
  style?: ViewStyle;
}

export const CustomDialog: React.FC<CustomDialogProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  onClose,
  confirmText = "Oui",
  cancelText = "Non",
  style,
}) => {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <View style={[styles.dialog, style]}>
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={onClose ? onClose : onCancel}
          hitSlop={12}
        >
          <AntDesign name="close" size={22} color="#888" />
        </TouchableOpacity>
        {title && <Text style={styles.title}>{title}</Text>}
        {message && <Text style={styles.message}>{message}</Text>}
        <View style={styles.buttonRow}>
          <CustomButton
            title={cancelText}
            onPress={onCancel}
            variant="outline"
            style={{ flex: 1, marginRight: 8 }}
          />
          <CustomButton
            title={confirmText}
            onPress={onConfirm}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  dialog: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 8,
    marginHorizontal: 16,
    minWidth: 260,
  },
  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
    marginTop: 8,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 16,
  },
});
