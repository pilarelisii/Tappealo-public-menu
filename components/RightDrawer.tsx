import { ReactNode, useEffect, useRef } from "react";
import { Animated, Dimensions, Pressable, View } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface RightDrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function RightDrawer({ open, onClose, children }: RightDrawerProps) {
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: open ? 0 : SCREEN_WIDTH,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [open]);

  if (!open) return null;

  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        backgroundColor: "#fff", // 🔥 CLAVE: fondo sólido
      }}
    >
      {/* Área táctil para cerrar (sin overlay visual) */}
      <Pressable style={{ flex: 1 }} onPress={onClose} />

      {/* Drawer */}
      <Animated.View
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "100%",
          backgroundColor: "#fff",
          transform: [{ translateX }],
        }}
      >
        {children}
      </Animated.View>
    </View>
  );
}