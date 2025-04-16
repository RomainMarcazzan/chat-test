import { ThemedText } from "../ThemedText";
import { CustomCard } from "../ui/CustomCard";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FlatList, TouchableOpacity, View, Dimensions } from "react-native";
import React, { useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

export type ToneOption = {
  label: string;
  value: "formal" | "cordial" | "humorous";
};

type ToneSelectionProps = {
  toneOptions: ToneOption[];
  selectedTone: "formal" | "cordial" | "humorous";
  onSelect: (tone: "formal" | "cordial" | "humorous") => void;
};

export const ToneSelection: React.FC<ToneSelectionProps> = ({
  toneOptions,
  selectedTone,
  onSelect,
}) => {
  const [carouselIndex, setCarouselIndex] = useState(
    toneOptions.findIndex((t) => t.value === selectedTone)
  );
  const screenWidth = Dimensions.get("window").width;

  // Animated shared value for indicator
  const animatedIndex = useSharedValue(carouselIndex);

  React.useEffect(() => {
    animatedIndex.value = withSpring(carouselIndex, {
      damping: 15,
      stiffness: 120,
    });
  }, [carouselIndex, animatedIndex]);

  return (
    <>
      <FlatList
        data={toneOptions}
        keyExtractor={(item) => item.value}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 16 }}
        contentContainerStyle={{ paddingHorizontal: 0 }}
        snapToInterval={screenWidth - 64}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: screenWidth - 64,
          offset: (screenWidth - 64) * index,
          index,
        })}
        initialScrollIndex={toneOptions.findIndex(
          (t) => t.value === selectedTone
        )}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(
            e.nativeEvent.contentOffset.x / (screenWidth - 64)
          );
          setCarouselIndex(idx);
        }}
        renderItem={({ item }) => {
          const isSelected = selectedTone === item.value;
          return (
            <View style={{ width: screenWidth - 64, marginHorizontal: 8 }}>
              <CustomCard selected={isSelected}>
                <TouchableOpacity
                  onPress={() => onSelect(item.value)}
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    zIndex: 2,
                    width: 20,
                    height: 20,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: isSelected ? "#0a7ea4" : "#ccc",
                    backgroundColor: isSelected ? "#0a7ea4" : "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {isSelected && (
                    <AntDesign name="check" size={14} color="#fff" />
                  )}
                </TouchableOpacity>
                <ThemedText
                  type="title"
                  style={{ fontSize: 22, marginBottom: 8, marginTop: 8 }}
                >
                  {item.label}
                </ThemedText>
                <ThemedText style={{ color: "#888" }}>
                  {item.value === "formal"
                    ? "Un ton professionnel et respectueux."
                    : item.value === "cordial"
                    ? "Un ton amical et chaleureux."
                    : "Un ton léger et humoristique."}
                </ThemedText>
              </CustomCard>
            </View>
          );
        }}
      />
      {/* Animated indicator */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 12,
        }}
      >
        {toneOptions.map((_, idx) => {
          const animatedStyle = useAnimatedStyle(() => ({
            width: withSpring(animatedIndex.value === idx ? 20 : 8, {
              damping: 15,
              stiffness: 120,
            }),
            backgroundColor: animatedIndex.value === idx ? "#0a7ea4" : "#ccc",
          }));
          return (
            <Animated.View
              key={idx}
              style={[
                {
                  height: 8,
                  borderRadius: 4,
                  marginHorizontal: 4,
                },
                animatedStyle,
              ]}
            />
          );
        })}
      </View>
    </>
  );
};
