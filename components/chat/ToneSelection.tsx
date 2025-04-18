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
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";

export type ToneOption = {
  label: string;
  labelMasculine: string;
  labelFeminine: string;
  value: "formal" | "cordial" | "humorous";
  descriptionMasculine: string;
  descriptionFeminine: string;
  message: string;
};

type ToneSelectionProps = {
  toneOptions: ToneOption[];
  selectedTone: "formal" | "cordial" | "humorous";
  onSelect: (tone: "formal" | "cordial" | "humorous") => void;
};

export const ToneSelection: React.FC<
  ToneSelectionProps & {
    assistantGender?: "masculine" | "feminine" | "neutral";
  }
> = ({ toneOptions, selectedTone, onSelect, assistantGender }) => {
  const [carouselIndex, setCarouselIndex] = useState(
    toneOptions.findIndex((t) => t.value === selectedTone)
  );
  const screenWidth = Dimensions.get("window").width;
  const theme = useColorScheme() ?? "light";

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
            <View
              style={{
                width: screenWidth - 64,
                marginHorizontal: 8,
              }}
            >
              <CustomCard selected={isSelected} style={{ flex: 1 }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: Colors[theme].lightGrey,
                    padding: 6,
                    minHeight: 250,
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    backgroundColor: Colors[theme].lightGrey,
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AntDesign
                      name="user"
                      size={200}
                      color={Colors[theme].tint}
                    />
                  </View>

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
                      borderColor: isSelected ? "#ccc" : "#0a7ea4",
                      backgroundColor: isSelected ? "#0a7ea4" : "#fff",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {isSelected && (
                      <AntDesign name="check" size={14} color="#fff" />
                    )}
                  </TouchableOpacity>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "flex-end",
                      alignSelf: "stretch",
                    }}
                  >
                    <View
                      style={{
                        padding: 6,
                        borderRadius: 10,
                        backgroundColor: "rgba(0,0,0,0.4)",
                      }}
                    >
                      <ThemedText
                        style={{
                          color: "#fff",
                        }}
                      >
                        {item.message}
                      </ThemedText>
                    </View>
                  </View>
                </View>
                <ThemedText
                  type="title"
                  style={{
                    fontSize: 18,
                    marginVertical: 8,
                  }}
                >
                  {assistantGender === "feminine"
                    ? item.labelFeminine
                    : item.labelMasculine}
                </ThemedText>
                <ThemedText style={{}}>
                  {assistantGender === "feminine"
                    ? item.descriptionFeminine
                    : item.descriptionMasculine}
                </ThemedText>
              </CustomCard>
            </View>
          );
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 12,
        }}
      >
        {toneOptions.map((_, idx) => {
          const animatedStyle = useAnimatedStyle(() => ({
            width: withSpring(animatedIndex.value === idx ? 32 : 16, {
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
