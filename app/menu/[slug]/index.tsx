import { CartNotification } from "@/components/CartNotification";
import { CheckoutModal, type OrderData } from "@/components/CheckoutModal";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MenuItem, type MenuItemType } from "@/components/MenuItem";
import { PromoItem } from "@/components/PromoItem";
import { RightDrawer } from "@/components/RightDrawer";
import { ShoppingCart } from "@/components/ShoppingCart";
import { AppImage } from "@/components/ui/AppImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createPublicCall } from "@/src/core/api/public";
import { Feather } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	findNodeHandle,
	Platform,
	Pressable,
	ScrollView,
	Text,
	UIManager,
	View,
} from "react-native";

import { CallButton } from "@/components/CallButton";
import { CallButtonModal } from "@/components/CallButtonModal";
import { InfoModal } from "@/components/InfoModal";
import {
	createPublicOrderPost,
	getPublicCategories,
	getPublicFeaturedProducts,
	getPublicOrderStatus,
	getPublicPaymentMethods,
	getPublicProducts,
	getPublicPromotions,
	getPublicQrLocation,
	getPublicVenue,
	type Category,
	type PublicPromotion,
	type PublicVenue,
} from "@/src/core/api/public";
import { OrderStatus } from "@/src/core/types";
import { useLanguage } from "@/hooks/useLanguages";
import { getPublicOrderByRef } from "@/src/core/api/public";

// helpers
function expandCartToOrderItems(cart: CartLine[], catalog: MenuItemType[]) {
	const map = new Map<
		string,
		{ product_id: string; name: string; description: string; quantity: number }
	>();

	const findByRemoteId = (pid: string) =>
		catalog.find((p: any) => String(p.remote_id ?? p.id) === pid);

	const upsert = (product_id: string, qty: number) => {
		const product = findByRemoteId(product_id);
		const name = product?.name ?? "Producto";
		const description = product?.description ?? "";
		const existing = map.get(product_id);
		if (existing) existing.quantity += qty;
		else map.set(product_id, { product_id, name, description, quantity: qty });
	};

	for (const line of cart) {
		if (line.kind === "product") {
			upsert(line.product_id, line.quantity);
		} else {
			for (const it of line.items) {
				upsert(it.product_id, it.quantity * line.quantity);
			}
		}
	}

	return Array.from(map.values());
}

async function setDeliveryLocation(value: string) {
	if (Platform.OS === "web") {
		try {
			sessionStorage.setItem("deliveryLocation", value);
			return;
		} catch {}
	}
	await AsyncStorage.setItem("deliveryLocation", value);
}

async function getDeliveryLocation() {
	if (Platform.OS === "web") {
		try {
			return sessionStorage.getItem("deliveryLocation");
		} catch {}
	}
	return await AsyncStorage.getItem("deliveryLocation");
}

function hashCode(str: string) {
	let h = 0;
	for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
	return h | 0;
}

function toCategoryKey(name: string) {
	return name.trim().toUpperCase();
}

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

type ActiveOrder = {
	id: string; 
	ref_order_id: string; 
	qr_location_id?: string; 
	created_at: number; 
	completed_at?: number;
};

const ACTIVE_ORDERS_KEY = "active_orders";

function pad(n: number, len = 2) {
	return String(n).padStart(len, "0");
}

async function setActiveOrders(list: ActiveOrder[]) {
	const json = JSON.stringify(list);
	if (Platform.OS === "web") {
		try {
			localStorage.setItem(ACTIVE_ORDERS_KEY, json);
			return;
		} catch {}
	}
	await AsyncStorage.setItem(ACTIVE_ORDERS_KEY, json);
}

async function getActiveOrders(): Promise<ActiveOrder[]> {
	let raw: string | null = null;

	if (Platform.OS === "web") {
		try {
			raw = localStorage.getItem(ACTIVE_ORDERS_KEY);
		} catch {}
	} else {
		raw = await AsyncStorage.getItem(ACTIVE_ORDERS_KEY);
	}

	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export async function addActiveOrder(order: ActiveOrder) {
	const current = await getActiveOrders();
	// evita duplicados por id
	const next = [order, ...current.filter((o) => o.id !== order.id)];
	await setActiveOrders(next);
}

async function removeActiveOrder(orderId: string) {
	const current = await getActiveOrders();
	await setActiveOrders(current.filter((o) => o.id !== orderId));
}

export default function Index() {
	const params = useLocalSearchParams<{
		utm_campaign?: string;
		payment?: string;
		slug?: string;
	}>();
	const { language, changeLanguage, t, ready } = useLanguage();
	const [mpPublicKey, setMpPublicKey] = useState<string | null>(null);
	const [slug, setSlug] = useState<string | null>(null);
	
	const [venue, setVenue] = useState<PublicVenue | null>(null);
	const [promotions, setPromotions] = useState<PublicPromotion[]>([]);
	const [apiCategories, setApiCategories] = useState<Category[]>([]);
	const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
	const [featured, setFeatured] = useState<
		{ id: number; name: string; description: string; image_url: string }[]
	>([]);

	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [cartItems, setCartItems] = useState<CartLine[]>([]);
	const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [infoModal, setInfoModal] = useState(false);
	const [callModal, setCallModal] = useState(false);
	const [checkoutQrLocationId, setCheckoutQrLocationId] = useState<string>("");
	const [activeOrders, setActiveOrdersState] = useState<ActiveOrder[]>([]);
	const [orderStatusById, setOrderStatusById] = useState<
		Record<string, OrderStatus>
	>({});
	const [deliveryLocationName, setDeliveryLocationName] = useState<
		string | null
	>(null);
	const scrollRef = useRef<ScrollView>(null);
	const sectionRefs = useRef<Record<string, unknown>>({});

	const categories = useMemo(() => {
		if (apiCategories.length === 0) return [];
		return apiCategories
			.filter((c) => c.enabled)
			.map((c) => toCategoryKey(c.name));
	}, [apiCategories]);

	const categoriesWithPromos = useMemo(() => {
		if (promotions.length === 0) return categories;
		return [t.promotions, ...categories];
	}, [categories, promotions.length]);

	// resolve slug
	useEffect(() => {
		const routeSlug = params.slug ? String(params.slug) : null;
		// si querés fallback default:
		// setSlug(routeSlug || "hilda");
		setSlug(routeSlug);
	}, [params.slug]);

	// UTM
	useEffect(() => {
		const utmRaw = params.utm_campaign ? String(params.utm_campaign) : "";
		const utmClean = utmRaw.split("?")[0]; // <- corta cualquier '?payment=...'

		if (utmClean) setDeliveryLocation(utmClean);

		const payment = params.payment;
		if (payment === "success") setCartItems([]);
	}, [params.payment, params.utm_campaign]);

	// first category
	useEffect(() => {
		if (!selectedCategory && categoriesWithPromos.length > 0) {
			setSelectedCategory(categoriesWithPromos[0]);
		}
	}, [categoriesWithPromos, selectedCategory]);

	//retorno pago
	useEffect(() => {
		const payment = params.payment;
		if (payment === "success") setCartItems([]);
	}, [params.payment, params.utm_campaign]);

	// payment methods and active orders
	useEffect(() => {
		if (!slug) return;
		let cancelled = false;

		(async () => {
			try {
        		const PENDING_MP_KEEP_MS = 2 * 60 * 1000;

				const list = await getActiveOrders();

				const cleanedList = list.filter((o: any) => {
					const id = String(o.id || "");

					if (id.startsWith("mp-pending-")) {
						return (
							Date.now() - Number(o.created_at || 0) < PENDING_MP_KEEP_MS
						);
					}

					return true;
				});

				if (cleanedList.length !== list.length) {
					await setActiveOrders(cleanedList);
				}

				setActiveOrdersState(cleanedList);


				const pms = await getPublicPaymentMethods(slug);
				if (cancelled) return;

				const mp = pms.find(
					(x: any) => String(x.type).toUpperCase() === "MP" && x.enabled
				);

				const key =
					(mp?.payment_data?.mp_public_key as string | undefined) ??
					(mp?.payment_data?.mp_public_key as string | undefined) ??
					null;

				setMpPublicKey(key);
			} catch (e) {
				console.log("Error payment methods:", e);
				setMpPublicKey(null);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [slug]);

  // order status
	useEffect(() => {
		if (!slug) return;

		let intervalId: any;

		const KEEP_MS = 90 * 1000; // ✅ 1 minuto y medio

		const toMillis = (v: any): number | null => {
			if (v === null || v === undefined) return null;
			const n = typeof v === "number" ? v : Number(v);
			return Number.isFinite(n) ? n : null;
		};

		const tick = async () => {
			try {
				const list = await getActiveOrders();
				// ✅ normalizamos completed_at por las dudas
				let updatedOrders = list.map((o: any) => ({
					...o,
					completed_at: toMillis(o.completed_at),
				}));

				setActiveOrdersState(updatedOrders);

				if (updatedOrders.length > 0) {
					const results = await Promise.allSettled(
						updatedOrders.map(async (o: any) => {
							const res = await getPublicOrderStatus(slug, o.id);
							const status = (res?.status ?? res) as OrderStatus | undefined; // por si tu endpoint devuelve string
							return { id: o.id, status };
						})
					);

					const nextMap: Record<string, OrderStatus> = {};
					const now = Date.now();
					let changed = false;

					for (const r of results) {
						if (r.status !== "fulfilled") continue;
						const { id, status } = r.value;
						if (!status) continue;

						nextMap[id] = status;

						if (status === "terminadas") {
							const idx = updatedOrders.findIndex((o: any) => o.id === id);
							if (idx !== -1 && !updatedOrders[idx].completed_at) {
								updatedOrders[idx] = {
									...updatedOrders[idx],
									completed_at: now,
								};
								changed = true;
							}
						}
					}

					setOrderStatusById(nextMap);

					if (changed) {
						await setActiveOrders(updatedOrders);
						setActiveOrdersState(updatedOrders);
					}
				}

				// ✅ Limpieza: borrar los terminados que ya pasaron KEEP_MS
				const now2 = Date.now();

				const filtered = updatedOrders.filter((o: any) => {
					const completedAt = toMillis(o.completed_at);
					if (!completedAt) return true; // todavía no terminó
					return now2 - completedAt < KEEP_MS;
				});

				if (filtered.length !== updatedOrders.length) {
					await setActiveOrders(filtered);
					setActiveOrdersState(filtered);
				}
			} catch (e) {
				console.log("poll orders error:", e);
			}
		};

		tick();
		intervalId = setInterval(tick, 30000);

		return () => clearInterval(intervalId);
	}, [slug]);

	// fetchAll polling
	useEffect(() => {
		if (!slug) return;

		let cancelled = false;
		let intervalId: any;

		const fetchAll = async () => {
			try {
				const v = await getPublicVenue(slug);
				if (cancelled) return;
				setVenue(v);

				if (!v.service_active || !v.enabled) {
					setApiCategories([]);
					setMenuItems([]);
					return;
				}

				const cats = await getPublicCategories(slug);
				if (cancelled) return;
				const enabledCats = cats.filter((c) => c.enabled);
				setApiCategories(enabledCats);

				const prods = await getPublicProducts(slug);
				if (cancelled) return;

				const mapped: MenuItemType[] = prods
					.filter((p) => p.enabled)
					.map((p: any) => {
						const numericId = Number(p.id);
						const id = Number.isFinite(numericId)
							? numericId
							: Math.abs(hashCode(String(p.id)));
						const catName =
							enabledCats.find((c) => c.id === p.category_id)?.name ?? "OTRAS";
						return {
							id,
							name: p.name ?? "",
							description: p.description ?? "",
							price: Number(p.price ?? 0),
							category: toCategoryKey(catName),
							image: p.image_url || "",
							enabled: Boolean(p.enabled),
							remote_id: String(p.id),
						} as any;
					});

				setMenuItems(mapped);

				const promos = await getPublicPromotions(slug, true);
				if (cancelled) return;
				setPromotions(
					Array.isArray(promos) ? promos.filter((p: any) => p.enabled) : []
				);

				const featuredProds = await getPublicFeaturedProducts(slug);
				if (cancelled) return;

				const featuredMapped = (featuredProds || [])
					.slice(0, 4)
					.map((p: any) => {
						const numericId = Number(p.id);
						const id = Number.isFinite(numericId)
							? numericId
							: Math.abs(hashCode(String(p.id)));
						return {
							id,
							name: p.name ?? "",
							description: p.description ?? "",
							image_url: p.image_url ?? "",
						};
					});

				setFeatured(featuredMapped);
			} catch (e) {
				console.log("Error fetching public API:", e);
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		};

		fetchAll();
		intervalId = setInterval(fetchAll, 5000);

		return () => {
			cancelled = true;
			clearInterval(intervalId);
		};
	}, [slug]);

	// deliveryLocation
	useEffect(() => {
		if (!slug) return;

		let cancelled = false;

		const resolveDeliveryLocationName = async () => {
			try {
				// 1) mejor fuente: lo que guardaste en storage
				const stored = await getDeliveryLocation();
				const raw = (
					stored ||
					(params.utm_campaign ? String(params.utm_campaign) : "") ||
					""
				)
					.split("?")[0]
					.trim();

				if (!raw) {
					if (!cancelled) setDeliveryLocationName(null);
					return;
				}

				// 2) casos "no QR": delivery / envio / take-away / etc
				const lower = raw.toLowerCase();
				const nonQrAliases: Record<string, string> = {
					delivery: "Para envío",
					envio: "Para envío",
					"para-envio": "Para envío",
					takeaway: "Para retirar",
					retiro: "Para retirar",
					"para-retirar": "Para retirar",
					local: "En el lugar",
					mesa: "En el lugar",
					"sin-ubicacion": "Sin ubicación",
					"sin ubicacion": "Sin ubicación",
				};

				if (nonQrAliases[lower]) {
					if (!cancelled) setDeliveryLocationName(nonQrAliases[lower]);
					return;
				}

				// 3) si no matchea alias, asumimos que es un qr_location_id real y pedimos el name
				const qr = await getPublicQrLocation(slug, raw);

				if (cancelled) return;

				// tu endpoint devuelve {found, id, name, ...}
				const name = qr && (qr.type || qr.id) ? String(qr.type || qr.id) : raw;
				setDeliveryLocationName(name);
			} catch (e) {
				console.log("Error resolving deliveryLocationName:", e);
				if (!cancelled) setDeliveryLocationName(null);
			}
		};

		resolveDeliveryLocationName();
		return () => {
			cancelled = true;
		};
	}, [slug, params.utm_campaign]);

	useEffect(() => {
		if (!slug) return;

		const payment = params.payment ? String(params.payment) : "";

		if (payment !== "success" && payment !== "failure") return;

		let cancelled = false;

		const handleMpReturn = async () => {
			try {
				const list = await getActiveOrders();

				const pendingMpOrders = list.filter((o) =>
					String(o.id).startsWith("mp_pending_")
				);

				if (pendingMpOrders.length === 0) return;

				// Si canceló/falló MP, borro todos los pending
				if (payment === "failure") {
					const nextList = list.filter(
						(o) => !String(o.id).startsWith("mp_pending_")
					);

					await setActiveOrders(nextList);
					setActiveOrdersState(nextList);
					return;
				}

				// Si pagó OK, busco la orden real creada por el webhook
				let changed = false;
				let nextList = [...list];

				for (const pending of pendingMpOrders) {
					const real = await getPublicOrderByRef(slug, pending.ref_order_id);

					if (cancelled) return;

					if (!real?.found) continue;

					nextList = nextList.filter((o) => o.id !== pending.id);

					nextList = [
						{
							id: real.id,
							ref_order_id: real.ref_order_id,
							qr_location_id: real.qr_location_id,
							created_at: Date.now(),
						},
						...nextList.filter((o) => o.id !== real.id),
					];

					changed = true;
				}

				if (changed) {
					await setActiveOrders(nextList);
					setActiveOrdersState(nextList);
				}
			} catch (e) {
				console.log("handle MP return error:", e);
			}
		};

		handleMpReturn();

		const intervalId =
			payment === "success" ? setInterval(handleMpReturn, 3000) : null;

		const timeoutId =
			payment === "success"
				? setTimeout(() => {
						if (intervalId) clearInterval(intervalId);
					}, 30000)
				: null;

		return () => {
			cancelled = true;
			if (intervalId) clearInterval(intervalId);
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [slug, params.payment]);

	const addPromotionToCart = (promo: PublicPromotion) => {
		setCartItems((prev) => {
			const key = `promo:${promo.id}`;
			const existing = prev.find((x) => x.kind === "promo" && x.id === key);
			if (existing && existing.kind === "promo") {
				return prev.map((x) =>
					x.id === key ? { ...x, quantity: x.quantity + 1 } : x
				);
			}
			return [
				...prev,
				{
					kind: "promo",
					id: key,
					promo_id: promo.id,
					name: promo.name ?? "Promo",
					price: Number(promo.price ?? 0),
					image_url: promo.image_url ?? null,
					items: (promo.items ?? []).map((it: any) => ({
						product_id: String(it.product_id),
						quantity: Number(it.quantity ?? 1),
					})),
					quantity: 1,
				},
			];
		});
	};

	const scrollToCategory = (category: string) => {
		setSelectedCategory(category);
		const target = sectionRefs.current[category];
		if (!target) return;

		if (Platform.OS === "web") {
			(target as HTMLElement).scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
			return;
		}

		if (!scrollRef.current) return;

		const node = findNodeHandle(target as any);
		const scrollNode = findNodeHandle(scrollRef.current as any);
		if (!node || !scrollNode) return;

		UIManager.measureLayout(
			node,
			scrollNode,
			() => {},
			(_x, y) =>
				scrollRef.current?.scrollTo({ y: Math.max(y - 120, 0), animated: true })
		);
	};

	const addToCart = (item: MenuItemType) => {
		setCartItems((prev) => {
			const product_id = String((item as any).remote_id ?? item.id);
			const key = `product:${product_id}`;
			const existing = prev.find((x) => x.kind === "product" && x.id === key);

			if (existing && existing.kind === "product") {
				return prev.map((x) =>
					x.id === key ? { ...x, quantity: x.quantity + 1 } : x
				);
			}

			return [
				...prev,
				{
					kind: "product",
					id: key,
					product_id,
					ui_id: item.id,
					name: item.name,
					description: item.description,
					price: item.price,
					image: (item as any).logo_url ?? (item as any).image ?? "",
					category: item.category,
					quantity: 1,
				},
			];
		});
	};

	const updateQuantity = (key: string, quantity: number) => {
		if (quantity <= 0) return removeItem(key);
		setCartItems((prev) =>
			prev.map((it) => (it.id === key ? { ...it, quantity } : it))
		);
	};

	const removeItem = (key: string) => {
		setCartItems((prev) => prev.filter((it) => it.id !== key));
	};

	const handleCheckout = async () => {
		setIsCartOpen(false);

		const qr =
			(await getDeliveryLocation()) ||
			(params.utm_campaign ? String(params.utm_campaign) : "");

		const qrClean = String(qr || "").split("?")[0];

		setCheckoutQrLocationId(qrClean || "sin-ubicacion");

		setIsCheckoutOpen(true);
	};

	const total = useMemo(
		() => cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0),
		[cartItems]
	);

	const totalItems = useMemo(
		() => cartItems.reduce((sum, it) => sum + it.quantity, 0),
		[cartItems]
	);

	const handleConfirmOrder = async (orderData: OrderData) => {
		try {
			if (!slug) throw new Error("Falta slug");

			// ✅ MP: NO creamos orden acá. El webhook la crea cuando se aprueba.
			if (orderData.paymentMethod === "mercado_pago") {
				setIsCheckoutOpen(false);
				return;
			}

			// ✅ EFECTIVO: acá sí creamos orden normal
			const qr_location_id = checkoutQrLocationId || "sin-ubicacion";

			const orderItems = expandCartToOrderItems(cartItems, menuItems);

			const payload = {
				qr_location_id,
				payment_method: "efectivo",
				total,
				name: orderData.customerName || undefined,
				phone: orderData.phoneNumber || undefined,
				additional_comments: orderData.notes || undefined,
				items: orderItems,
			};

			const orderResp = await createPublicOrderPost(slug, payload);

			await addActiveOrder({
				id: orderResp.id,
				ref_order_id: orderResp.ref_order_id ?? 
				qr_location_id,
				created_at: Date.now(),
			});

			setCartItems([]);
			setIsCheckoutOpen(false)
		} catch (e: any) {
			console.log("❌ Error creando orden:", e?.message ?? e, e);
		}
	};

	const handleCallWaiter = async () => {
		try {
			if (!slug) throw new Error("Falta slug");

			// obtenés qr_location_id igual que en checkout
			const raw =
				(await getDeliveryLocation()) ||
				(params.utm_campaign ? String(params.utm_campaign) : "");

			const qrClean = String(raw || "")
				.split("?")[0]
				.trim();

			// si es alias tipo "delivery" no tiene sentido llamar mozo
			const lower = qrClean.toLowerCase();
			const nonQr = new Set([
				"delivery",
				"envio",
				"para-envio",
				"takeaway",
				"retiro",
				"para-retirar",
				"sin-ubicacion",
				"sin ubicacion",
			]);

			if (!qrClean || nonQr.has(lower)) {
				setCallModal(false);
				return;
			}

			await createPublicCall(slug, { qr_location_id: qrClean });

			setCallModal(false);
			// opcional: toast/alert de "Llamada enviada"
		} catch (e: any) {
			console.log("❌ Error call waiter:", e?.message ?? e);
		}
	};

	if (isLoading) {
		return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
	}

	return (
		<View className="flex-1 bg-background text-foreground">
			<ScrollView
				ref={scrollRef}
				className="flex-1"
				contentContainerStyle={{ paddingBottom: 160 }}
			>
				{/* Header */}
				<View className="bg-card/80 border-b border-black/10 px-4 py-2 items-center justify-center relative">
					<AppImage
						uri={(venue as any)?.logo_url}
						style={{ height: 48, width: 160 }}
					/>

					<View className="absolute left-4 top-2">
						<Button
							onPress={() => setInfoModal(true)}
							variant="menu"
							size="icon"
							className="relative"
						>
							<MaterialIcons
								name="info-outline"
								size={19}
								className="text-foreground"
							/>
						</Button>
					</View>
					{params.utm_campaign !== undefined && (
						<View className="absolute right-4 top-2">
							<Button
								variant="menu"
								size="icon"
								className="relative"
								onPress={() => setIsCartOpen(true)}
							>
								<Feather
									name="shopping-cart"
									size={18}
									className="text-foreground"
								/>
								{totalItems > 0 && (
									<View className="absolute -top-2 -right-2">
										<Badge
											variant="secondary"
											className="h-5 w-5 items-center justify-center p-0"
										>
											<Text className="text-xs font-semibold">
												{totalItems}
											</Text>
										</Badge>
									</View>
								)}
							</Button>
						</View>
					)}
				</View>

				{featured?.length > 0 && (
					<FeaturedCarousel
						featuredDishes={featured}
						onJumpToDish={({ id }) => {
							const item = menuItems.find((x) => x.id === id);
							if (item?.category) scrollToCategory(item.category);
						}}
					/>
				)}

				{/* Category Tabs */}
				<View className="bg-background/95 px-4 text-foreground py-3 border-b border-black/10">
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						<View className="flex-row gap-2 items-center">
							{(categoriesWithPromos.length
								? categoriesWithPromos
								: [`${t.loading}"..."`]
							).map((cat) => {
								const active = selectedCategory === cat;
								return (
									<Pressable
										key={cat}
										onPress={() =>
											categoriesWithPromos.length && scrollToCategory(cat)
										}
										className={[
											"px-5 py-2",
											active ? "border-b-2 border-accent" : "",
										].join(" ")}
									>
										<Text
											className={
												active
													? "font-semibold text-foreground"
													: "text-black/60 font-semibold"
											}
										>
											{cat}
										</Text>
									</Pressable>
								);
							})}
						</View>
					</ScrollView>
				</View>

				{/* Disabled venue */}
				{venue && (!venue.service_active || !venue?.enabled) && (
					<View className="px-4 py-10 items-center">
						<Text className="text-lg font-semibold">
							{t.serviceInactiveTitle}
						</Text>
						<Text className="opacity-70 mt-2">
							{t.serviceInactiveDescription}
						</Text>
					</View>
				)}

				{/* Categories */}
				<View className="px-4 py-8">
					{promotions.length > 0 && (
						<View
							className="mb-5"
							ref={(el) => {
								sectionRefs.current["PROMOCIONES"] = el;
							}}
						>
							<Text className="text-2xl text-foreground font-bold mb-6">
								{t.promotions}
							</Text>

							<View className="gap-4">
								{promotions.map((p) => (
									<PromoItem
										key={p.id}
										promo={p}
										catalog={menuItems}
										onAddPromo={(pp) => {
											addPromotionToCart(pp);
										}}
										active={params.utm_campaign !== undefined}
									/>
								))}
							</View>
						</View>
					)}

					<View className="gap-12">
						{categories.map((cat) => {
							const items = menuItems.filter((it) => it.category === cat);
							if (items.length === 0) return null;

							return (
								<View
									key={cat}
									ref={(el) => {
										sectionRefs.current[cat] = el;
									}}
								>
									<Text className="text-2xl text-foreground font-bold mb-6">
										{cat}
									</Text>

									<View className="gap-4">
										{items.map((it) => {
											const productKey = `product:${String((it as any).remote_id ?? it.id)}`;
											const cartItem = cartItems.find(
												(c) => c.kind === "product" && c.id === productKey
											);
											return (
												<MenuItem
													key={it.id}
													item={it}
													onAddToCart={addToCart}
													cartQuantity={cartItem?.quantity || 0}
													active={params.utm_campaign !== undefined}
												/>
											);
										})}
									</View>
								</View>
							);
						})}
					</View>
				</View>

				<View className="border-t border-black/10 bg-card/50 py-6 px-4 items-center">
					<Text className="text-sm opacity-70">powered by Tappealo</Text>
				</View>
			</ScrollView>

			{deliveryLocationName === "en_lugar" && (
				<CallButton
					onCallButton={() => setCallModal(true)}
					active={totalItems > 0 || activeOrders.length > 0}
				/>
			)}

			<RightDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)}>
				<ShoppingCart
					items={cartItems}
					catalog={menuItems}
					activeOrders={activeOrders}
					orderStatusById={orderStatusById}
					deliveryLocation={deliveryLocationName}
					onUpdateQuantity={updateQuantity}
					onRemoveItem={removeItem}
					onCheckout={handleCheckout}
					onClose={() => setIsCartOpen(false)}
					onAddItem={addToCart}
				/>
			</RightDrawer>

			<CheckoutModal
				isOpen={isCheckoutOpen}
				onClose={() => setIsCheckoutOpen(false)}
				items={cartItems}
				total={total}
				onConfirm={handleConfirmOrder}
				mpPublicKey={mpPublicKey}
				venueSlug={slug}
				deliveryLocationName={deliveryLocationName}
				qrLocationId={checkoutQrLocationId}
				refOrderId={""}
			/>
			<CallButtonModal
				isOpen={callModal}
				onClose={() => setCallModal(false)}
				onSubmit={handleCallWaiter}
			/>

			{!isCartOpen && !isCheckoutOpen && (
				<CartNotification
					totalItems={totalItems}
					total={total}
					onOpenCart={() => setIsCartOpen(true)}
					activeOrders={activeOrders}
					orderStatusById={orderStatusById}
				/>
			)}

			{infoModal && (
				<InfoModal
					isOpen={infoModal}
					onClose={() => setInfoModal(false)}
					location_link={venue?.location_link}
					social_link={venue?.social_link}
					phone={venue?.phone}
					address={{ address_1: venue?.address_1, address_2: venue?.address_2 }}
				/>
			)}
		</View>
	);
}
