import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "./ui/button";
import { useLanguageContext } from "@/src/i18n/LanguageProvider";

export type OrderStatus =
	| "entrante"
	| "preparacion"
	| "retirar"
	| "falta-pagar"
	| "terminadas";

export type ActiveOrder = {
	id: string;
	ref_order_id: string;
	created_at: number; // Date.now()
	completed_at?: number; // si ya terminó
};

interface CartNotificationProps {
	totalItems: number;
	total: number;
	onOpenCart: () => void;

	// 👇 nuevo
	activeOrders: ActiveOrder[];
	orderStatusById: Record<string, OrderStatus>;
}

function formatARS(n: number) {
	return `$${Math.round(n).toLocaleString("es-AR")}`;
}

function statusLabel(s?: OrderStatus) {
	switch (s) {
		case "entrante":
			return "Pendiente";
		case "preparacion":
			return "Preparando";
		case "retirar":
		case "falta-pagar":
			return "Listo";
		default:
			return "Pendiente";
	}
}

export function CartNotification({
	totalItems,
	total,
	onOpenCart,
	activeOrders,
	orderStatusById,
}: CartNotificationProps) {
	const [isAnimating, setIsAnimating] = useState(false);
	const { language, changeLanguage, t, ready } = useLanguageContext()
	// animación solo cuando cambia cantidad de items del carrito
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

	const hasActiveOrders = activeOrders.length > 0;

	// Mostramos el pedido más reciente (created_at más grande)
	const latestOrder = useMemo(() => {
		if (!hasActiveOrders) return null;
		return [...activeOrders].sort((a, b) => b.created_at - a.created_at)[0];
	}, [activeOrders, hasActiveOrders]);

	const latestStatus = latestOrder
		? orderStatusById[latestOrder.id]
		: undefined;

	// Si no hay carrito y no hay pedidos => nada
	if (totalItems === 0 && !hasActiveOrders) return null;

	// Si hay items en carrito, priorizamos carrito (aunque haya pedidos)
	const showCart = totalItems > 0;

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
						{showCart ? (
							// ✅ Carrito
							<View className="flex-row items-center gap-3">
								<View className="w-12 h-12 bg-black/5 rounded-lg items-center justify-center">
									<Feather name="shopping-cart" size={22} color="#6B7280" />
								</View>

								<View>
									<Text className="text-sm text-foreground opacity-70">
										{itemsLabel}
									</Text>
									<Text className="text-xl font-bold text-foreground">
										{formatARS(total)}
									</Text>
								</View>
							</View>
						) : (
							// ✅ Pedidos en curso (carrito vacío)
							<View className="flex-row items-center gap-3">
								<View className="w-12 h-12 bg-black/5 rounded-lg items-center justify-center">
									<Feather name="clock" size={22} color="#6B7280" />
								</View>

								<View className="min-w-0 flex">
									<Text className="text-md font-semibold text-foreground">
										{t.youHave} {activeOrders.length}{" "}
										{activeOrders.length === 1 ? t.activeOrderSingle : t.activeOrderPlural} 
									</Text>

									{latestOrder ? (
										<Text
											className="text-sm text-foreground opacity-70"
											numberOfLines={1}
										>
											{t.latest}: {latestOrder.ref_order_id} ·{" "}
											{statusLabel(latestStatus)}
										</Text>
									) : null}
								</View>
							</View>
						)}

						<Button
							variant="menu"
							onPress={onOpenCart}
							className="px-8 py-4 rounded-xl shrink-0"
						>
							<Text className="text-base font-semibold text-foreground">
								{showCart ? t.goToCart : t.viewOrders}
							</Text>
						</Button>
					</View>
				</View>
			</View>
		</View>
	);
}
