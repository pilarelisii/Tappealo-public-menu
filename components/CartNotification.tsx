import { useEffect, useMemo, useState } from "react";
import { Pressable, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Button } from "./ui/button";

interface CartNotificationProps {
  totalItems: number;
  total: number;
  onOpenCart: () => void;
}

function formatARS(n: number) {
  return `$${Math.round(n).toLocaleString("es-AR")}`;
}

export function CartNotification({ totalItems, total, onOpenCart }: CartNotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (totalItems > 0) {
      setIsAnimating(true);
      const t = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  const itemsLabel = useMemo(
    () => `${totalItems} ${totalItems === 1 ? "producto" : "productos"}`,
    [totalItems]
  );

  if (totalItems === 0) return null;

  return (
    <View className="absolute left-0 right-0 bottom-0 z-50 p-0 sm:p-4">
      <View className="mx-auto w-full max-w-2xl px-0 sm:px-4">
        <View
          className={[
            "bg-white sm:rounded-2xl shadow-2xl border border-black/10 overflow-hidden",
            isAnimating ? "opacity-95" : "opacity-100",
          ].join(" ")}
        >
          <View className="flex-row items-center justify-between p-4 gap-4">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 bg-black/5 rounded-lg items-center justify-center">
                <Feather name="shopping-cart" size={22} color="#6B7280" />
              </View>

              <View>
                <Text className="text-sm text-foreground opacity-70">{itemsLabel}</Text>
                <Text className="text-xl font-bold text-foreground">
                  {formatARS(total)}
                </Text>
              </View>
            </View>

            <Button
              variant="menu"
              onPress={onOpenCart}
              className="px-8 py-4 rounded-xl"
            >
              <Text className="text-base font-semibold text-foreground">Ir al carrito</Text>
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}