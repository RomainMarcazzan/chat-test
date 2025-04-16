import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface CustomCardProps {
  children: React.ReactNode;
  selected?: boolean;
  style?: ViewStyle;
}

export const CustomCard: React.FC<CustomCardProps> = ({
  children,
  selected = false,
  style,
}) => {
  return (
    <View style={[styles.card, selected && styles.selected, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  selected: {
    borderColor: "#0a7ea4",
    borderWidth: 1,
    shadowColor: "#0a7ea4",
    shadowOpacity: 0.15,
  },
});
