import { useCallback, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";
import BottomSheetCore, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { useThemeColor } from "@/hooks/useThemeColor";

type BottomSheetProps = {
  children: React.ReactNode;
  snapPoints?: string[];
  onChange?: (index: number) => void;
};

export function BottomSheet({
  children,
  snapPoints: customSnapPoints,
  onChange,
}: BottomSheetProps) {
  const backgroundColor = useThemeColor({}, "background");
  const bottomSheetRef = useRef<BottomSheetCore>(null);

  // Variables
  const snapPoints = useMemo(
    () => customSnapPoints ?? ["25%", "50%", "90%"],
    [customSnapPoints]
  );

  // Callbacks
  const handleSheetChanges = useCallback(
    (index: number) => {
      onChange?.(index);
    },
    [onChange]
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <BottomSheetCore
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor }}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetView style={styles.contentContainer}>
        {children}
      </BottomSheetView>
    </BottomSheetCore>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  indicator: {
    backgroundColor: "#A1A1A1",
  },
});
