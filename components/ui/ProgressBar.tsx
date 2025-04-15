import React from "react";
import { View, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ProgressBarProps {
  step: number;
  total: number;
}

export function ProgressBar({ step, total }: ProgressBarProps) {
  const progress = Math.min((step + 1) / total, 1);
  const barColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "progressBackground");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View
        style={[
          styles.bar,
          { width: `${progress * 100}%`, backgroundColor: barColor },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
    marginBottom: 16,
  },
  bar: {
    height: "100%",
    borderRadius: 4,
  },
});
