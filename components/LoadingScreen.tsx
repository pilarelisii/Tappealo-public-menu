import { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";

import { AppImage } from "./ui/AppImage";

const LOGO = require("@/assets/taprealo-logo.png");

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.05, duration: 700, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );

    pulse.start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
        setVisible(false);
        onLoadingComplete();
        pulse.stop();
      });
    }, 2000);

    return () => {
      clearTimeout(timer);
      pulse.stop();
    };
  }, [onLoadingComplete, opacity, scale]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        opacity,
        zIndex: 100,
        alignItems: "center",
        justifyContent: "center",

        // si querés el fondo sí o sí (sin depender de className)
        // backgroundColor: "#000", // o el color que uses
      }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <AppImage
          source={LOGO}
          contentFit="contain"
          style={{ width: 320, height: 120 }}
        />
      </Animated.View>
    </Animated.View>
  );
}