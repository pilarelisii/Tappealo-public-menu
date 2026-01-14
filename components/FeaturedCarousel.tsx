import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Card } from "./ui/card";
import { AppImage } from "./ui/AppImage";

type FeaturedDish = {
  id: number;
  name: string;
  description: string;
  image_url: string;
};

type FeaturedCarouselProps = {
  featuredDishes: FeaturedDish[];
  onJumpToDish?: (dish: { id: number; name: string }) => void;
  intervalMs?: number;
};

export function FeaturedCarousel({
  featuredDishes,
  onJumpToDish,
  intervalMs = 5000,
}: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<any>(null);

  const safeList = Array.isArray(featuredDishes) ? featuredDishes : [];
  const hasItems = safeList.length > 0;

  // reset index si cambia la lista
  useEffect(() => {
    setCurrentIndex(0);
  }, [safeList.length]);

  // autoplay (solo si hay 2+)
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (safeList.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeList.length);
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [safeList.length, intervalMs]);

  const currentDish = useMemo(() => {
    if (!hasItems) return null;
    return safeList[Math.min(currentIndex, safeList.length - 1)];
  }, [hasItems, safeList, currentIndex]);

  if (!currentDish) return null;

  const handlePress = () => {
    onJumpToDish?.({ id: currentDish.id, name: currentDish.name });
  };

  return (
    <View className="relative w-full overflow-hidden">
      <View className="relative h-[380px]">
        {/* Background image */}
        <View className="absolute inset-0">
          <AppImage
            uri={currentDish.image_url}
            style={{ width: "100%", height: "100%" }}
          />

          {/* Overlay gradient */}
          <LinearGradient
            colors={[
              "rgba(255,255,255,0)",
              "rgba(255,255,255,0.55)",
              "rgba(255,255,255,0.95)",
            ]}
            style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
          />
        </View>

        {/* Card content */}
        <View className="relative h-full items-center justify-end pb-10 px-4">
          <Pressable onPress={handlePress} className="w-full max-w-2xl">
            <Card className="p-6 bg-card/90 border border-black/10">
              <View className="gap-2">
                <Text className="text-3xl font-bold text-foreground">
                  {currentDish.name}
                </Text>
                {!!currentDish.description && (
                  <Text className="text-base text-foreground opacity-80">
                    {currentDish.description}
                  </Text>
                )}
              </View>
            </Card>
          </Pressable>
        </View>
      </View>

      {/* Dots */}
      {safeList.length > 1 && (
        <View className="absolute bottom-4 left-0 right-0 items-center">
          <View className="flex-row gap-2">
            {safeList.map((_, idx) => {
              const active = idx === currentIndex;
              return (
                <Pressable
                  key={idx}
                  onPress={() => setCurrentIndex(idx)}
                  accessibilityLabel={`Go to slide ${idx + 1}`}
                >
                  <View
                    className={[
                      "h-2 rounded-full",
                      active ? "w-8 bg-accent" : "w-2 bg-black/15",
                    ].join(" ")}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}