import { ScrollView, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AppImage } from "./ui/AppImage";
import type { MenuItemType } from "./MenuItem";

export type CartLine =
  | {
      kind: "product";
      id: string;
      product_id: string;
      ui_id: number;
      name: string;
      description: string;
      price: number;
      image?: any;
      category?: string;
      quantity: number;
    }
  | {
      kind: "promo";
      id: string;
      promo_id: string;
      name: string;
      price: number;
      image_url?: string | null;
      items: { product_id: string; quantity: number }[];
      quantity: number;
    };

interface ShoppingCartProps {
  items: CartLine[];
  catalog: MenuItemType[];
  orderStatus?: [] | null;
  onUpdateQuantity: (key: string, quantity: number) => void;
  onRemoveItem: (key: string) => void;
  onCheckout: () => void;
  onClose: () => void;
  onAddItem: (item: MenuItemType) => void;
}

function formatARS(n: number) {
  return `$${Math.round(n).toLocaleString("es-AR")}`;
}

function getSuggestedItems(cartItems: CartLine[], catalog: MenuItemType[]): MenuItemType[] {
  if (cartItems.length === 0) return [];
  if (catalog.length === 0) return [];

  const productLines = cartItems.filter(
    (i): i is Extract<CartLine, { kind: "product" }> => i.kind === "product"
  );
  if (productLines.length === 0) return [];

  const cartProductIds = new Set(productLines.map((i) => i.ui_id));
  const cartCategories = new Set(productLines.map((i) => i.category).filter(Boolean) as string[]);

  const sameCategory = catalog
    .filter((p) => p.enabled !== false)
    .filter((p) => !cartProductIds.has(p.id))
    .filter((p) => cartCategories.has(p.category));

  const anyOther = catalog
    .filter((p) => p.enabled !== false)
    .filter((p) => !cartProductIds.has(p.id));

  const pool = sameCategory.length > 0 ? sameCategory : anyOther;

  return pool
    .slice()
    .sort((a, b) => a.price - b.price)
    .slice(0, 3);
}

export function ShoppingCart({
  items,
  catalog,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onClose,
  onAddItem,
}: ShoppingCartProps) {
  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);

  const suggestedItems = getSuggestedItems(items, catalog);
  const dulcesConImagen = [30, 31, 34];

  const shouldShowImage = (category: string, id: number) => {
    return (
      category !== "FRIOS" &&
      category !== "WHITES" &&
      category !== "SALADOS" &&
      category !== "OTRAS" &&
      category !== "BEBIDAS" &&
      (category !== "DULCES" || dulcesConImagen.includes(id))
    );
  };

  if (items.length === 0) {
    return (
      <View className="flex-1 m-5">
        <View className="mb-6">
          <View className="flex-row items-center gap-2">
            <Button variant="ghost" size="icon" onPress={onClose}>
              <Feather name="arrow-left" size={22} />
            </Button>
            <Text className="text-2xl font-bold text-foreground">Carrito</Text>
          </View>
        </View>

        <View className="flex-1 items-center justify-center">
          <Text className="opacity-70 text-foreground">Tu carrito está vacío</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 p-6">
      {/* Header */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Button variant="ghost" size="icon" onPress={onClose}>
              <Feather name="arrow-left" size={22} />
            </Button>
            <Text className="text-2xl font-bold text-foreground">Carrito</Text>
          </View>

          <Badge variant="secondary" className="px-3 py-1">
            <Text className="text-base font-semibold">{totalItems}</Text>
          </Badge>
        </View>
      </View>

      {/* List */}
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="gap-4 mb-6">
          {items.map((item) => {
            const canShowImage = item.kind === "product" && !!item.image;

            return (
              <View key={item.id} className="flex-row gap-3 pb-4 border-b border-black/10">
                {canShowImage ? (
                  <View className="w-20 h-20 overflow-hidden rounded-md bg-black/5">
                    <AppImage uri={item.image as string} style={{ width: "100%", height: "100%" }} />
                  </View>
                ) : null}

                <View className="flex-1 min-w-0">
                  <Text className="font-semibold text-base text-foreground" numberOfLines={1}>
                    {item.name}
                  </Text>

                  <Text className="text-base font-bold text-foreground">{formatARS(item.price)}</Text>

                  <View className="flex-row items-center gap-2 mt-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Feather name="minus" size={16} />
                    </Button>

                    <Text className="text-base font-semibold w-8 text-center text-foreground">
                      {item.quantity}
                    </Text>

                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Feather name="plus" size={16} />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 ml-auto"
                      onPress={() => onRemoveItem(item.id)}
                    >
                      <Feather name="trash-2" size={16} />
                    </Button>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Complementos */}
          {suggestedItems.length > 0 ? (
            <View className="pt-6 border-t border-black/10 mt-6">
              <Text className="text-lg font-bold mb-3 text-foreground">Complementá tu orden</Text>

              <View className="gap-3">
                {suggestedItems.map((it) => {
                  const hasImage = typeof it.image === "string" && it.image.length > 0;
                  const showImage = hasImage && shouldShowImage(it.category, it.id);

                  return (
                    <View
                      key={it.id}
                      className="flex-row gap-3 items-center p-3 rounded-lg border border-black/10"
                    >
                      {showImage ? (
                        <View className="w-16 h-16 overflow-hidden rounded-md bg-black/5">
                          <AppImage uri={it.image as string} style={{ width: "100%", height: "100%" }} />
                        </View>
                      ) : null}

                      <View className="flex-1 min-w-0">
                        <Text className="font-semibold text-sm text-foreground" numberOfLines={1}>
                          {it.name}
                        </Text>
                        <Text className="text-sm font-bold text-primary">{formatARS(it.price)}</Text>
                      </View>

                      <Button size="icon" variant="menu" className="h-9 w-9 shrink-0" onPress={() => onAddItem(it)}>
                        <Feather name="plus" size={18} />
                      </Button>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="border-t border-black/10 pt-4 gap-4">
        <View className="flex-row justify-between">
          <Text className="text-xl font-bold text-foreground">Total:</Text>
          <Text className="text-xl font-bold text-accent">{formatARS(total)}</Text>
        </View>

        <Button onPress={onCheckout} size="lg" className="w-full" variant="menu">
          <Text className="font-semibold">Realizar Pedido</Text>
        </Button>
      </View>
    </View>
  );
}