import { createMpPreference } from "@/src/core/api/public";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { RatingData, RatingModal } from "./RatingModal";
import type { CartLine } from "./ShoppingCart";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useLanguageContext } from "@/src/i18n/LanguageProvider";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartLine[];
  total: number;
  onConfirm: (orderData: OrderData) => void;
  deliveryLocationName: string | null;
  mpPublicKey?: string | null;
  venueSlug?: string | null;

  // ✅ nuevos: los pasás desde Index
  qrLocationId: string;
  refOrderId: string;
}

export interface OrderData {
  notes: string;
  items: CartLine[];
  total: number;
  deliveryLocation: string;
  phoneNumber: string;
  customerName?: string;
  paymentMethod: "efectivo" | "mercado_pago";
}

function formatARS(n: number) {
  return `$${Math.round(n).toLocaleString("es-AR")}`;
}

const COUNTRY_OPTIONS = [
  { value: "54", label: "🇦🇷 +54" },
  { value: "598", label: "🇺🇾 +598" },
  { value: "55", label: "🇧🇷 +55" },
  { value: "56", label: "🇨🇱 +56" },
  { value: "595", label: "🇵🇾 +595" },
  { value: "591", label: "🇧🇴 +591" },
  { value: "51", label: "🇵🇪 +51" },
  { value: "57", label: "🇨🇴 +57" },
  { value: "52", label: "🇲🇽 +52" },
  { value: "34", label: "🇪🇸 +34" },
  { value: "1", label: "🇺🇸 +1" },
];

function buildReturnUrls(baseReturnUrl: string, slug: string, utm: string) {
  const base = String(baseReturnUrl || "").replace(/\/$/, "");
  const path = `${encodeURIComponent(slug)}/`;
  const qs = new URLSearchParams({
    utm_source: "qr",
    utm_campaign: utm,
  }).toString();

  const returnBase = `${base}/${path}?${qs}`;

  return {
    success_url: `${returnBase}&payment=success`,
    failure_url: `${returnBase}&payment=failure`,
    pending_url: `${returnBase}&payment=pending`,
  };
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  total,
  onConfirm,
  mpPublicKey,
  venueSlug,
  qrLocationId,
  refOrderId,
  deliveryLocationName,
}: CheckoutModalProps) {
  const { language, changeLanguage, t, ready } = useLanguageContext()
  const [notes, setNotes] = useState("");
  const [countryCode, setCountryCode] = useState("54");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [customerName, setCustomerName] = useState("");

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);

  const [mpLoading, setMpLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const deliveryLocation = useMemo(() => {
    if (typeof window === "undefined") return "sin-ubicacion";
    const params = new URLSearchParams(window.location.search);
    return params.get("utm_campaign") || "sin-ubicacion";
  }, []);

  const validatePhoneNumber = (phone: string) => {
    const clean = phone.replace(/[\s\-\(\)]/g, "");
    return /^\d{8,12}$/.test(clean);
  };

  const getFullPhoneNumber = () => {
    const clean = phoneNumber.replace(/[\s\-\(\)]/g, "");
    if (!clean) return "";
    if (countryCode === "54") {
      const without0 = clean.startsWith("0") ? clean.slice(1) : clean;
      return `54${without0.startsWith("9") ? "" : "9"}${without0}`;
    }
    return `${countryCode}${clean}`;
  };

  const handlePhoneChange = (value: string) => {
    const sanitized = value.replace(/[^\d\s\-]/g, "");
    setPhoneNumber(sanitized);

    if (sanitized && !validatePhoneNumber(sanitized)) setPhoneError("Ingresá solo el número sin código de país");
    else setPhoneError("");
  };

  const confirmOrder = (paymentMethod: "efectivo" | "mercado_pago") => {
    const fullPhoneNumber = getFullPhoneNumber();
    onConfirm({
      notes,
      items,
      total,
      deliveryLocation,
      phoneNumber: fullPhoneNumber,
      customerName: customerName || undefined,
      paymentMethod,
    });
    setIsConfirmed(true);
  };

  useEffect(() => {
    if (!isOpen) {
      setShowPaymentMethod(false);
      setIsConfirmed(false);
      setShowRatingModal(false);
      setNotes("");
      setPhoneNumber("");
      setPhoneError("");
      setCountryCode("54");
      setCustomerName("");
      setMpLoading(false);
      setErrorMsg("");
    }
  }, [isOpen]);

  const handleMercadoPagoWeb = async () => {
  try {
    setErrorMsg("");

    if (!venueSlug) throw new Error("Falta venueSlug");
    if (!mpPublicKey) throw new Error("Mercado Pago no disponible");
    if (!validatePhoneNumber(phoneNumber)) throw new Error("Revisá el número de teléfono");

    setMpLoading(true);

    const fullPhone = getFullPhoneNumber();

    const baseReturnUrl =
      (process.env.EXPO_PUBLIC_RETURN_BASE as string) ||
      (typeof window !== "undefined" ? window.location.origin : "");

    const urls = buildReturnUrls(baseReturnUrl, venueSlug, qrLocationId);

    const pref = await createMpPreference(venueSlug, {
      items: items.map((it) => ({ name: it.name, quantity: it.quantity, unit_price: it.price })),
      total,
      ref_order_id: refOrderId,
      qr_location_id: qrLocationId,
      notes,
      phone_number: fullPhone || undefined,
      customer_name: customerName || undefined,
      ...urls,
    });

    const init = pref.init_point || pref.sandbox_init_point;
    if (!init) throw new Error("Preferencia creada pero falta init_point");

    window.location.href = init;
  } catch (e: any) {
    console.error(e);
    setErrorMsg(e?.message ?? "No se pudo iniciar Mercado Pago");
  } finally {
    setMpLoading(false);
  }
};

  const handleRatingSubmit = (rating: RatingData) => {
    console.log("Rating submitted:", rating);
    setShowRatingModal(false);
    onClose();
  };

  return (
		<>
			<Modal
				visible={isOpen}
				transparent
				animationType="fade"
				onRequestClose={onClose}
			>
				<Pressable className="flex-1 bg-black/40" onPress={onClose} />

				<View className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-black/10">
					<ScrollView
						contentContainerStyle={{ padding: 20, paddingBottom: 24 }}
					>
						{isConfirmed ? (
							<View className="min-h-[400px] items-center justify-center py-12">
								<View className="mb-8">
									<View className="w-24 h-24 rounded-full items-center justify-center bg-green-500">
										<Feather name="check" size={44} color="#fff" />
									</View>
								</View>
								<Text className="text-3xl font-bold mb-4 text-center text-foreground">
									¡{t.preparingOrder}!
								</Text>
								{deliveryLocation === "envio" ||
									(deliveryLocation === "retiro_envio" && (
										<Text className="text-lg text-center mb-2 text-foreground">
											{t.deliveryContact}
										</Text>
									))}
								{deliveryLocation === "retiro" && (
									<Text className="text-lg text-center mb-2 text-foreground">
										{t.pickupContact}
									</Text>
								)}
								{deliveryLocation === "en_lugar" && (
									<Text className="text-lg text-center mb-2 text-foreground">
										{t.tableDelivery}
									</Text>
								)}

								<Text className="text-xl font-semibold text-center mb-8 text-foreground">
									{t.thanksPurchase}
								</Text>
								<Button
									size="lg"
									variant="menu"
									className="w-full max-w-xs"
									onPress={() => {
										setIsConfirmed(false);
										setShowRatingModal(true);
										onClose();
									}}
								>
									<Text className="font-semibold">{t.accept}</Text>
								</Button>
							</View>
						) : !showPaymentMethod ? (
							<>
								<View className="mb-6">
									<View className="flex-row items-center gap-2">
										<Button variant="ghost" size="icon" onPress={onClose}>
											<Feather name="arrow-left" size={22} />
										</Button>
										<Text className="text-2xl font-bold text-foreground">
											{t.confirmOrder}
										</Text>
									</View>
								</View>

								<View className="gap-6">
									<View className="gap-4">
										<Text className="font-semibold text-foreground">
											{t.orderSummary}
										</Text>

										{items.map((it) => (
											<View
												key={it.id}
												className="flex-row items-center justify-between py-2 border-b border-black/10"
											>
												<View className="flex-1 pr-3">
													<Text className="font-medium">{it.name}</Text>
													<Text className="text-sm opacity-70">
														{t.quantity}: {it.quantity}
													</Text>
												</View>
												<Text className="text-foreground">
													{formatARS(it.price * it.quantity)}
												</Text>
											</View>
										))}

										<View className="flex-row items-center justify-between pt-4 border-t border-black/10">
											<Text>{t.total}:</Text>
											<Text className="text-lg font-bold text-primary">
												{formatARS(total)}
											</Text>
										</View>
									</View>

									<View className="gap-4">
										<View>
											<Label>{t.phoneNumber} *</Label>
											<View className="flex-row gap-2 mt-1">
												<Pressable
													className="h-10 px-3 rounded-md border border-black/10 bg-white justify-center"
													onPress={() => {
														const idx = COUNTRY_OPTIONS.findIndex(
															(x) => x.value === countryCode
														);
														const next =
															COUNTRY_OPTIONS[
																(idx + 1) % COUNTRY_OPTIONS.length
															];
														setCountryCode(next.value);
													}}
												>
													<Text className="text-sm">
														{
															COUNTRY_OPTIONS.find(
																(x) => x.value === countryCode
															)?.label
														}
													</Text>
												</Pressable>

												<Input
													placeholder={
														countryCode === "54"
															? "11 1234-5678"
															: t.phoneWithoutCountryCode
													}
													value={phoneNumber}
													onChangeText={handlePhoneChange}
													className={`border ${phoneError && "border-red-500"}`}
													keyboardType="phone-pad"
												/>
											</View>
											<Text className="text-xs opacity-70 mt-1">
												{t.phoneHelp}
											</Text>
											{phoneError ? (
												<Text className="text-xs text-red-600 mt-1">
													{phoneError}
												</Text>
											) : null}
										</View>

										<View>
											<Label>{t.name}</Label>
											<Input
												placeholder="Tu nombre"
												value={customerName}
												onChangeText={setCustomerName}
											/>
										</View>

										<View>
											<Label>{t.specialNotesOptional}</Label>
											<Textarea
												placeholder={t.specialNotesPlaceholder}
												value={notes}
												onChangeText={setNotes}
												numberOfLines={3}
											/>
										</View>
									</View>

									<View className="gap-3">
										<Button
											variant="menu"
											className="w-full"
											disabled={!phoneNumber || !!phoneError}
											onPress={() => setShowPaymentMethod(true)}
										>
											<Text className="font-semibold">{t.continue}</Text>
										</Button>

										<Button
											variant="outline"
											className="w-full"
											onPress={onClose}
										>
											<Text className="font-semibold">{t.cancel}</Text>
										</Button>
									</View>
								</View>
							</>
						) : (
							<>
								<View className="mb-6">
									<View className="flex-row items-center gap-2">
										<Button
											variant="ghost"
											size="icon"
											onPress={() => setShowPaymentMethod(false)}
										>
											<Feather name="arrow-left" size={22} />
										</Button>
										<Text className="text-2xl font-bold">
											{t.paymentMethod}
										</Text>
									</View>
								</View>

								{errorMsg ? (
									<View className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
										<Text className="text-red-700">{errorMsg}</Text>
									</View>
								) : null}

								<View className="gap-6">
									<View className="pt-4 border-t border-black/10">
										<View className="flex-row justify-between items-center">
											<Text className="text-lg font-bold">{t.totalToPay}:</Text>
											<Text className="text-lg font-bold text-foreground">
												{formatARS(total)}
											</Text>
										</View>
									</View>
									{deliveryLocationName !== "envio" && (
										<>
											{/* METODO DE PAGO EFECTIVO */}
											<Button
												variant="outline"
												size="lg"
												className="w-full"
												onPress={() => confirmOrder("efectivo")}
											>
												<Text className="font-semibold">{t.cashAtCounter}</Text>
											</Button>
										</>
									)}
									{/* METODO DE PAGO MP */}
									{Platform.OS === "web" ? (
										<View className="gap-2">
											<Text className="text-base font-semibold">
												{t.mercadoPago}
											</Text>
											<Button
												variant="menu"
												size="lg"
												className="w-full"
												disabled={
													mpLoading ||
													!phoneNumber ||
													!!phoneError ||
													!mpPublicKey
												}
												onPress={handleMercadoPagoWeb}
											>
												<Text className="font-semibold">
													{mpLoading ? t.redirecting : t.payWithMercadoPago}
												</Text>
											</Button>
											<Text className="text-xs opacity-70">
												{t.mercadoPagoRedirectDescription}
											</Text>
										</View>
									) : null}{" "}
									
									<Button
										variant="ghost"
										className="w-full"
										onPress={() => setShowPaymentMethod(false)}
									>
										<Text className="font-semibold">{t.back}</Text>
									</Button>
								</View>
							</>
						)}
					</ScrollView>
				</View>
			</Modal>

			{/* <RatingModal
				isOpen={showRatingModal}
				onClose={() => {
					setShowRatingModal(false);
					onClose();
				}}
				onSubmit={handleRatingSubmit}
			/> */}
		</>
	);
}