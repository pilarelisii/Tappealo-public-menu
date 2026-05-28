import { ScrollView, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AppImage } from "./ui/AppImage";
import type { MenuItemType } from "./MenuItem";
import { OrderProgressBar } from "./OrderProgress";
import { useLanguageContext } from "@/src/i18n/LanguageProvider";
import { useEffect } from "react";

type OrderStatus = 'entrante' | 'preparacion' | 'retirar' | 'falta-pagar' | 'terminadas';
type ActiveOrder = {
	id: string;
	ref_order_id: string;
	qr_location_id?: string;
	created_at: number;
	completed_at?: number;
};

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
	  complements?: string[];
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
  activeOrders: ActiveOrder[];
  orderStatusById: Record<string, OrderStatus>;
  deliveryLocation: [] | string | null; 
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
  const MAX_COMPLEMENTS = 3;

  const productLines = cartItems.filter(
    (i): i is Extract<CartLine, { kind: "product" }> => i.kind === "product"
  );

  if (productLines.length === 0 || catalog.length === 0) return [];

  const cartProductIds = new Set(productLines.map((i) => String(i.ui_id)));
  const selectedIds = new Set<string>();
  const selected: MenuItemType[] = [];

  const getProductFromCartLine = (line: Extract<CartLine, { kind: "product" }>) => {
    return catalog.find((p) => String(p.id) === String(line.ui_id));
  };

  const addComplementsFromProduct = (
    product: MenuItemType | undefined,
    amount: number
  ) => {
    if (!product?.complements?.length) return;

    for (const complementId of product.complements) {
      if (selected.length >= MAX_COMPLEMENTS) return;

      const id = String(complementId);

      if (selectedIds.has(id)) continue;
      if (cartProductIds.has(id)) continue;

      const complement = catalog.find((p) => String(p.id) === id);

      if (!complement) continue;
      if (complement.enabled === false) continue;

      selected.push(complement);
      selectedIds.add(id);

      const fromThisProduct = selected.filter((s) =>
        product.complements?.map(String).includes(String(s.id))
      );

      if (fromThisProduct.length >= amount) break;
    }
  };

  const productsInCart = productLines
    .map(getProductFromCartLine)
    .filter(Boolean) as MenuItemType[];

  if (productsInCart.length === 1) {
    addComplementsFromProduct(productsInCart[0], 3);
  } else if (productsInCart.length === 2) {
    addComplementsFromProduct(productsInCart[0], 1);
    addComplementsFromProduct(productsInCart[1], 2);
  } else {
    productsInCart.slice(0, 3).forEach((product) => {
      addComplementsFromProduct(product, 1);
    });
  }

  return selected;
}

export function ShoppingCart({
  items,
  catalog,
  activeOrders,
  orderStatusById,
  deliveryLocation,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onClose,
  onAddItem,
}: ShoppingCartProps) {
	const { language, changeLanguage, t, ready } = useLanguageContext()
  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);

  const suggestedItems = getSuggestedItems(items, catalog);
  
  if (items.length === 0) {
    return (
			<View className="flex-1 m-5">
				<View className="mb-6">
					<View className="flex-row items-center gap-2">
						<Button variant="ghost" size="icon" onPress={onClose}>
							<Feather name="arrow-left" size={22} />
						</Button>
						<Text className="text-2xl font-bold text-foreground">{t.cart}</Text>
					</View>
				</View>
				{activeOrders.length > 0 && (
					<View className="m-4 gap-3">
						{activeOrders.map((o) => (
							<View
								key={o.id}
								className="p-3 rounded-xl border border-black/10"
							>
								<Text className="font-bold text-foreground m-3">
									{t.order} {o.ref_order_id} {t.inProgress}
								</Text>

								<OrderProgressBar
									status={orderStatusById[o.id] ?? t.incoming}
									deliveryLocation={deliveryLocation}
								/>
								{deliveryLocation === "en_lugar" &&
									orderStatusById[o.id] === "falta-pagar" && (
										<Text className="font-light text-md text-foreground m-5">
											Podes pedir la cuenta mediante el timbre o acercarte a la
											caja para pagar. ¡Gracias por tu visita!
										</Text>
									)}
							</View>
						))}
					</View>
				)}

				<View className="flex-1 items-center justify-center">
					<Text className="opacity-70 text-foreground">{t.emptyCart}</Text>
				</View>
			</View>
		);
  }

  return (
		<View className="flex-1 p-6">
			{/* Header */}
			<View className="mb-8">
				<View className="flex-row items-center justify-between">
					<View className="flex-row items-center gap-2">
						<Button variant="ghost" size="icon" onPress={onClose}>
							<Feather name="arrow-left" size={22} />
						</Button>
						<Text className="text-2xl font-bold text-foreground">{t.cart}</Text>
					</View>

					<Badge variant="secondary" className="px-3 py-1">
						<Text className="text-base font-semibold">{totalItems}</Text>
					</Badge>
				</View>
				{activeOrders.length > 0 && (
					<View className="m-2 gap-3">
						{activeOrders.map((o) => (
							<View
								key={o.id}
								className="p-3 rounded-xl border border-black/10"
							>
								<Text className="font-semibold text-foreground m-3">
									{t.order} {o.ref_order_id} {t.inProgress}
								</Text>

								<OrderProgressBar
									status={orderStatusById[o.id] ?? t.incoming}
									deliveryLocation={deliveryLocation}
								/>
								{deliveryLocation === "en_lugar" &&
									orderStatusById[o.id] === "falta-pagar" && (
										<Text>
											Podes pedir la cuenta mediante el timbre o acercarte a la
											caja para pagar. ¡Gracias por tu visita!
										</Text>
									)}
							</View>
						))}
					</View>
				)}
			</View>

			{/* List */}
			<ScrollView
				className="flex-1"
				contentContainerStyle={{ paddingBottom: 24 }}
			>
				<View className="gap-4 mb-6">
					{items.map((item) => {
						const canShowImage = (item.kind === "product" && !!item.image) || (item.kind === "promo" && !!item.image_url);

						return (
							<View
								key={item.id}
								className="flex-row gap-3 pb-4 border-b border-black/10"
							>
								{canShowImage ? (
									<View className="w-20 h-20 overflow-hidden rounded-md bg-black/5">
										<AppImage
											uri={(item.kind === "product" && item.image) || (item.kind === "promo" && item.image_url) as string}
											style={{ width: "100%", height: "100%" }}
										/>
									</View>
								) : null}

								<View className="flex-1 min-w-0">
									<Text
										className="font-semibold text-base text-foreground"
										numberOfLines={1}
									>
										{item.name}
									</Text>

									<Text className="text-base font-bold text-foreground">
										{formatARS(item.price)}
									</Text>

									<View className="flex-row items-center gap-2 mt-2">
										<Button
											size="icon"
											variant="outline"
											className="h-8 w-8"
											onPress={() =>
												onUpdateQuantity(item.id, item.quantity - 1)
											}
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
											onPress={() =>
												onUpdateQuantity(item.id, item.quantity + 1)
											}
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
							<Text className="text-lg font-semibold mb-3 text-foreground">
								{t.completeOrder}
							</Text>

							<View className="gap-3">
								{suggestedItems.map((it) => {
									return (
										<View
											key={it.id}
											className="flex-row gap-3 items-center p-3 rounded-lg border border-black/10"
										>
											{it.image ? (
												<View className="w-16 h-16 overflow-hidden rounded-md bg-black/5">
													<AppImage
														uri={it.image as string}
														style={{ width: "100%", height: "100%" }}
													/>
												</View>
											) : null}

											<View className="flex-1 min-w-0">
												<Text
													className="font-semibold text-sm text-foreground"
													numberOfLines={1}
												>
													{it.name}
												</Text>
												<Text className="text-sm font-bold text-primary">
													{formatARS(it.price)}
												</Text>
											</View>

											<Button
												size="icon"
												variant="menu"
												className="h-9 w-9 shrink-0"
												onPress={() => onAddItem(it)}
											>
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
					<Text className="text-xl font-bold text-foreground">{t.total}:</Text>
					<Text className="text-xl font-bold text-foreground">
						{formatARS(total)}
					</Text>
				</View>

				<Button
					onPress={onCheckout}
					size="lg"
					className="w-full"
					variant="menu"
				>
					<Text className="font-semibold">{t.placeOrder}</Text>
				</Button>
			</View>
		</View>
	);
}