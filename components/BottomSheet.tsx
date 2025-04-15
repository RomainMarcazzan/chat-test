import {
  useCallback,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { StyleSheet } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { useThemeColor } from "@/hooks/useThemeColor";

export type BottomSheetRef = {
  present: () => void;
  dismiss: () => void;
};

type BottomSheetProps = {
  children: React.ReactNode;
  snapPoints: string[];
  index: number;
  onChange?: (index: number) => void;
  visible?: boolean;
};

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ children, snapPoints, index, onChange, visible }, ref) => {
    const backgroundColor = useThemeColor({}, "background");
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    // Variables
    const snapPointsMemo = useMemo(() => snapPoints, [snapPoints]);

    useImperativeHandle(ref, () => ({
      present: () => bottomSheetRef.current?.present(),
      dismiss: () => bottomSheetRef.current?.dismiss(),
    }));

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

    // Effects
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPointsMemo}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor }}
        handleComponent={null}
        enablePanDownToClose={true}
        index={index}
      >
        <BottomSheetView style={styles.contentContainer}>
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
    borderWidth: 2,
    borderColor: "red",
  },
});
