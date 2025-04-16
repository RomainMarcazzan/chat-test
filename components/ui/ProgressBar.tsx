import React from "react";
import { View, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface ProgressBarProps {
  step: number;
  total: number;
}

export function ProgressBar({ step, total }: ProgressBarProps) {
  const progress = Math.min((step + 1) / total, 1);
  const barColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "progressBackground");

  const animatedProgress = useSharedValue(progress);

  React.useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 400 });
  }, [progress, animatedProgress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`,
    backgroundColor: barColor,
  }));

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Animated.View style={[styles.bar, animatedStyle]} />
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
