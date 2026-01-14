import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppImage } from "@/components/ui/AppImage";
import type { PublicPromotion } from "@/src/core/api/public";
import type { MenuItemType } from "@/components/MenuItem";

interface PromoItemProps {
  promo: PublicPromotion;
  catalog: MenuItemType[];
  onAddPromo: (promo: PublicPromotion) => void;
}

function formatARS(n: number) {
  return `$${Math.round(n).toLocaleString("es-AR")}`;
}

export function PromoItem({ promo, catalog, onAddPromo }: PromoItemProps) {
  const getProductName = (productId: string) => {
    const numericId = Number(productId);
    return catalog.find((p) => p.id === numericId)?.name || "Producto";
  };

  const includeText = useMemo(() => {
    const items = promo.items ?? [];
    if (!items.length) return null;

    const base = items
      .slice(0, 3)
      .map((it) => `${it.quantity}x ${getProductName(it.product_id)}`)
      .join(" · ");

    return `Incluye: ${base}${items.length > 3 ? " · ..." : ""}`;
  }, [promo.items, catalog]);

  return (
    <View className="rounded-xl border border-black/10 bg-card/60 overflow-hidden">
      {promo.image_url ? (
        <View className="h-40 w-full bg-black/5">
          <AppImage uri={promo.image_url} style={{ width: "100%", height: "100%" }} />
        </View>
      ) : null}

      <View className="p-4 gap-3">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 min-w-0">
            <Text className="text-lg font-bold text-foreground" numberOfLines={2}>
              {promo.name}
            </Text>

            <View className="flex-row items-center gap-2 mt-2 flex-wrap">
              {promo.discount ? (
                <Badge variant="secondary" className="px-2 py-1 bg-yellow-200">
                  <Text className="text-xs font-semibold">{promo.discount}% OFF</Text>
                </Badge>
              ) : null}
            </View>
          </View>

          <View className="items-end">
            <Text className="text-xl font-bold text-primary">{formatARS(promo.price)}</Text>
          </View>
        </View>

        {includeText ? (
          <Text className="text-xs text-black/70">{includeText}</Text>
        ) : null}

        <Button variant="menu" className="w-full flex-row items-center justify-center gap-2" onPress={() => onAddPromo(promo)}>
          <Feather name="plus" size={18} />
          <Text className="font-semibold">Agregar promo</Text>
        </Button>
      </View>
    </View>
  );
}