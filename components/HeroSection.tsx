import React from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { ArrowRight } from "lucide-react-native";

const HeroSection = () => {
	const openDemo = () => {
		window.open("https://w.app/fij1pn", "_blank");
	};

	return (
		<View style={styles.section}>
			<View style={styles.overlay} />

			<View style={styles.container}>
				<View style={styles.content}>
					<View style={styles.badge}>
						<Text style={styles.badgeText}>
							🚀 Plataforma digital para restaurantes
						</Text>
					</View>

					<Text style={styles.title}>
						Digitalizá tu restaurante con{" "}
						<Text style={styles.highlight}>Tappealo</Text>
					</Text>

					<Text style={styles.description}>
						Un sistema completo que permite a los restaurantes gestionar su menú
						digital, mesas y comunicación con los clientes mediante códigos QR.
					</Text>

					<Pressable style={styles.button} onPress={() => window.open("https://w.app/fij1pn", "_blank")}>
						<Text style={styles.buttonText}>Solicitar demo</Text>
						<ArrowRight size={18} color="#fff" style={{ marginLeft: 6 }} />
					</Pressable>

					<Text style={styles.footerText}>
						Tappealo ayuda a los restaurantes a mejorar la experiencia del
						cliente, acelerar el servicio y organizar mejor la operación diaria.
					</Text>
				</View>
			</View>
		</View>
	);
};

export default HeroSection;

const styles = StyleSheet.create({
	section: {
		paddingTop: 120,
		paddingBottom: 80,
		position: "relative",
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.03)",
	},
	container: {
		paddingHorizontal: 20,
		maxWidth: 900,
		alignSelf: "center",
		width: "100%",
	},
	content: {
		alignItems: "center",
	},
	badge: {
		backgroundColor: "#F3F4F6",
		paddingHorizontal: 16,
		paddingVertical: 6,
		borderRadius: 999,
		marginBottom: 20,
	},
	badgeText: {
		fontSize: 13,
		color: "#6B7280",
	},
	title: {
		fontSize: 38,
		fontWeight: "800",
		textAlign: "center",
		color: "#111827",
		marginBottom: 16,
		lineHeight: 44,
	},
	highlight: {
		color: "#4e3526",
	},
	description: {
		fontSize: 18,
		textAlign: "center",
		color: "#6B7280",
		marginBottom: 28,
		lineHeight: 26,
		maxWidth: 600,
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#4e3526",
		paddingVertical: 14,
		paddingHorizontal: 24,
		borderRadius: 10,
		marginBottom: 20,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 16,
	},
	footerText: {
		fontSize: 14,
		textAlign: "center",
		color: "#6B7280",
		maxWidth: 600,
		lineHeight: 22,
	},
});
