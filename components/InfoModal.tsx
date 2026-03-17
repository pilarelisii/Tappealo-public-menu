import React, { useMemo } from "react";
import { Modal, Pressable, View, Text, Platform, Linking } from "react-native";
import { Entypo } from "@expo/vector-icons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Button } from "./ui/button";

// ✅ Solo se importa en native (no rompe web)
let WebView: any = null;
if (Platform.OS !== "web") {
  WebView = require("react-native-webview").WebView;
}

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;

  social_link?: string | null;

  // ✅ lo que pega el comercio (maps.app.goo.gl o google.com/maps)
  location_link?: string | null;

  // ✅ (opcional) si lo guardás normalizado/embed desde settings
  location_embed?: string | null;

  venueName?: string | null;

  // (si querés seguir mostrando address, lo dejamos)
  address: {
    address_1?: string | null;
    address_2?: string | null;
  };

  // (si querés seguir mostrando phone, lo dejamos)
  phone?: string | null;
}

function safeUrl(u?: string | null) {
  const s = (u ?? "").trim();
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) return null;
  return s;
}

function isMapsShortLink(url?: string | null) {
  return !!url && /maps\.app\.goo\.gl/i.test(url);
}

// ✅ fallback SOLO si no tenés embed ni link válido
function buildMapsQuery(
  venueName?: string | null,
  address1?: string | null,
  address2?: string | null
) {
  const base = [venueName, address1, address2]
    .map((x) => (x ?? "").trim())
    .filter(Boolean)
    .join(" ");

  // Ajustá si querés ciudad fija o sacala
  return base ? `${base}, La Plata, Buenos Aires, Argentina` : null;
}

// ✅ embed por query (fallback)
function buildMapsEmbedFromQuery(query?: string | null) {
  if (!query) return null;
  return `https://www.google.com/maps?output=embed&q=${encodeURIComponent(query)}`;
}

function buildMapsOpenFromQuery(query?: string | null) {
  if (!query) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// ✅ abre externo (native + web)
async function openExternal(url?: string | null) {
  const u = safeUrl(url);
  if (!u) return;

  if (Platform.OS === "web") {
    window.open(u, "_blank", "noopener,noreferrer");
    return;
  }

  const can = await Linking.canOpenURL(u);
  if (can) await Linking.openURL(u);
}

export function InfoModal({
  isOpen,
  onClose,
  social_link,
  location_link,
  location_embed,
  phone,
  venueName,
  address,
}: InfoModalProps) {
  const socialUrl = useMemo(() => safeUrl(social_link), [social_link]);

  // ✅ si existe embed guardado, usamos ese
  const embedUrl = useMemo(() => safeUrl(location_embed), [location_embed]);

  // ✅ para abrir maps usamos location_link si existe
  const externalMapsUrl = useMemo(() => safeUrl(location_link), [location_link]);

  // ✅ fallback: si no hay embed ni link, armamos query con venue+address
  const query = useMemo(
    () => buildMapsQuery(venueName, address?.address_1, address?.address_2),
    [venueName, address?.address_1, address?.address_2]
  );

  const fallbackEmbedUrl = useMemo(
    () => (query ? buildMapsEmbedFromQuery(query) : null),
    [query]
  );

  const mapsOpenUrl = useMemo(() => {
    if (externalMapsUrl) return externalMapsUrl;
    if (query) return buildMapsOpenFromQuery(query);
    return null;
  }, [externalMapsUrl, query]);

/**
 * Abre el dialer para llamar al número de teléfono pasado por parámetro.
 * Si no se pasa ningún parámetro, no se hace nada.
 * Si no se puede abrir el dialer, se mostrará un mensaje de error en la consola.
 * @param {string | null | undefined} phone - El número de teléfono al que se quiere llamar.
 */
	const callPhone = (phone: string | null | undefined) => {
		if (!phone) return;

		const url = `tel:${phone}`;

		Linking.openURL(url).catch(() => {
			console.log("No se pudo abrir el dialer");
		});
	};
  
  // ✅ qué mostramos en el mapa:
  // 1) location_embed (ideal)
  // 2) fallback embed por query (si no hay embed)
  const mapToShow = embedUrl ?? fallbackEmbedUrl;

  const addressLine1 = (address?.address_1 ?? "").trim();
  const addressLine2 = (address?.address_2 ?? "").trim();

  return (
		<Modal
			visible={isOpen}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			{/* Backdrop */}
			<Pressable className="flex-1 bg-black/40" onPress={onClose} />

			{/* Dialog */}
			<View className="absolute left-4 right-4 top-24 mx-auto max-w-md rounded-2xl bg-white p-5 border border-black/10">
				<Text className="text-center text-xl font-semibold text-foreground">
					Información
				</Text>

				<View className="mt-5 gap-4">
					{/* Instagram */}
					<View className="rounded-xl p-3 bg-black/5 flex-row items-center justify-between">
						<View className="flex-row items-center gap-2">
							<Entypo name="instagram" size={18} color="#111827" />
							<Text className="text-foreground font-medium">Instagram</Text>
						</View>

						<Button
							variant="menu"
							disabled={!socialUrl}
							onPress={() => openExternal(socialUrl)}
						>
							<Text className="font-semibold">
								{socialUrl ? "Abrir" : "No disponible"}
							</Text>
						</Button>
					</View>

					{/* Telefono */}
					<View className="rounded-xl p-3 bg-black/5 flex-row items-center justify-between">
						<View className="flex-row items-center gap-2">
							<Entypo name="phone" size={18} color="#111827" />
							<Text className="text-foreground font-medium">Telefono</Text>
						</View>

						<Button
							variant="menu"
							disabled={!phone}
							onPress={() => callPhone(phone)}
						>
							<Text className="font-semibold">
								{phone ? "Llamar" : "No disponible"}
							</Text>
						</Button>
					</View>
					{/* Dirección (opcional, si NO querés mostrarla, borrá este bloque) */}
					<View className="rounded-xl p-3 bg-black/5">
						<View className="flex-row items-center gap-2 mb-2">
							<EvilIcons name="location" size={22} color="#111827" />
							<Text className="text-foreground font-semibold">Dirección</Text>
						</View>

						{!!addressLine1 && (
							<Text className="text-foreground">{addressLine1}</Text>
						)}
						{!!addressLine2 && (
							<Text className="text-foreground opacity-80">{addressLine2}</Text>
						)}

						{!addressLine1 && !addressLine2 && (
							<Text className="text-foreground opacity-70">
								Sin dirección cargada
							</Text>
						)}
					</View>

					{/* Mapa */}
					<View className="rounded-xl overflow-hidden border border-black/10">
						<View className="px-3 py-2 bg-black/5 flex-row items-center justify-between">
							<Text className="text-foreground font-semibold">Mapa</Text>

							<Button
								variant="outline"
								disabled={!mapsOpenUrl}
								onPress={() => openExternal(mapsOpenUrl)}
							>
								<Text className="font-semibold">
									{mapsOpenUrl ? "Abrir Maps" : "No disponible"}
								</Text>
							</Button>
						</View>

						{/* ✅ Render según plataforma */}
						{mapToShow ? (
							Platform.OS === "web" ? (
								<View style={{ height: 220 }}>
									<iframe
										src={mapToShow}
										width="100%"
										height="100%"
										style={{ border: 0 }}
										loading="lazy"
										referrerPolicy="no-referrer-when-downgrade"
									/>
								</View>
							) : WebView ? (
								<View style={{ height: 220 }}>
									<WebView
										source={{ uri: mapToShow }}
										javaScriptEnabled
										domStorageEnabled
										originWhitelist={["*"]}
									/>
								</View>
							) : (
								<View className="p-4">
									<Text className="text-foreground opacity-70">
										No se pudo cargar el mapa.
									</Text>
								</View>
							)
						) : isMapsShortLink(location_link) ? (
							<View className="p-4">
								<Text className="text-foreground font-medium mb-2">
									📍 Ubicación disponible
								</Text>
								<Text className="text-foreground opacity-70 mb-3">
									Este link corto de Google Maps no se puede embeber. Abrilo en
									Maps.
								</Text>

								<Button
									variant="menu"
									onPress={() => openExternal(location_link)}
								>
									<Text className="font-semibold">Abrir en Google Maps</Text>
								</Button>
							</View>
						) : (
							<View className="p-4">
								<Text className="text-foreground opacity-70">
									No hay un link válido para mostrar el mapa.
								</Text>
							</View>
						)}
					</View>

					{/* Cerrar */}
					<Button variant="outline" onPress={onClose}>
						<Text className="font-semibold">Cerrar</Text>
					</Button>
				</View>
			</View>
		</Modal>
	);
}