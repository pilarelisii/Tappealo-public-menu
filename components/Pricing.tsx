import React from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { Check, Sparkles } from "lucide-react-native";

const plans = [
	{
		name: "Plan Básico",
		price: "119",
		desc: "Hasta 10 mesas",
		features: [
			"Menú digital con QR",
			"Hasta 10 mesas",
			"Panel administrador",
			"Página propia",
			"Soporte por email",
		],
		highlighted: false,
	},
	{
		name: "Plan Pro",
		price: "249",
		desc: "Hasta 20 mesas",
		features: [
			"Todo del Plan Básico",
			"Hasta 20 mesas",
			"Carga con Excel",
			"Comunicación cliente",
			"Soporte prioritario",
		],
		highlighted: true,
	},
	{
		name: "Plan Premium",
		price: "379",
		desc: "Más de 20 mesas",
		features: [
			"Todo del Plan Pro",
			"Mesas ilimitadas",
			"Funciones avanzadas",
			"Soporte dedicado",
			"Personalización",
		],
		highlighted: false,
	},
];

const Pricing = () => {
	const openDemo = () => {
		Linking.openURL("https://w.app/fij1pn");
	};

	return (
		<View style={styles.section}>
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.eyebrow}>Precios</Text>
					<Text style={styles.title}>Planes para cada restaurante</Text>
				</View>

				<View style={styles.launchBox}>
					<Sparkles size={18} color="#4e3526" />
					<Text style={styles.launchText}>
						Lanzamiento: Plan Premium al precio del Básico + 15 días de prueba
						gratis
					</Text>
				</View>

				<View style={styles.cards}>
					{plans.map((p, i) => (
						<View
							key={i}
							style={[
								styles.card,
								p.highlighted ? styles.cardHighlighted : styles.cardDefault,
							]}
						>
							<Text
								style={[
									styles.planName,
									p.highlighted && styles.planNameHighlighted,
								]}
							>
								{p.name}
							</Text>

							<View style={styles.priceRow}>
								<Text
									style={[
										styles.price,
										p.highlighted && styles.priceHighlighted,
									]}
								>
									${p.price}
								</Text>
								<Text
									style={[
										styles.priceSuffix,
										p.highlighted && styles.priceSuffixHighlighted,
									]}
								>
									USD/mes
								</Text>
							</View>

							<Text
								style={[
									styles.planDesc,
									p.highlighted && styles.planDescHighlighted,
								]}
							>
								{p.desc}
							</Text>

							<View style={styles.featuresList}>
								{p.features.map((f, j) => (
									<View key={j} style={styles.featureRow}>
										<Check
											size={16}
											color={p.highlighted ? "#FFFFFF" : "#4e3526"}
										/>
										<Text
											style={[
												styles.featureText,
												p.highlighted && styles.featureTextHighlighted,
											]}
										>
											{f}
										</Text>
									</View>
								))}
							</View>

							<Pressable
								style={[
									styles.button,
									p.highlighted ? styles.buttonOutline : styles.buttonFilled,
								]}
								onPress={openDemo}
							>
								<Text
									style={[
										styles.buttonText,
										p.highlighted
											? styles.buttonTextOutline
											: styles.buttonTextFilled,
									]}
								>
									Solicitar demo
								</Text>
							</Pressable>
						</View>
					))}
				</View>
			</View>
		</View>
	);
};

export default Pricing;

const styles = StyleSheet.create({
	section: {
		paddingVertical: 60,
		backgroundColor: "#FFFFFF",
	},
	container: {
		paddingHorizontal: 16,
		maxWidth: 1100,
		width: "100%",
		alignSelf: "center",
	},
	header: {
		alignItems: "center",
		marginBottom: 18,
	},
	eyebrow: {
		fontSize: 12,
		fontWeight: "600",
		letterSpacing: 2,
		textTransform: "uppercase",
		color: "#4e3526",
		marginBottom: 8,
	},
	title: {
		fontSize: 30,
		fontWeight: "700",
		textAlign: "center",
		color: "#111827",
	},
	launchBox: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		marginBottom: 36,
		paddingHorizontal: 8,
	},
	launchText: {
		flex: 1,
		maxWidth: 500,
		fontSize: 13,
		fontWeight: "600",
		color: "#4e3526",
		textAlign: "center",
	},
	cards: {
		gap: 16,
	},
	card: {
		borderRadius: 20,
		borderWidth: 1,
		padding: 24,
	},
	cardDefault: {
		backgroundColor: "#FFFFFF",
		borderColor: "#E5E7EB",
	},
	cardHighlighted: {
		backgroundColor: "#4e3526",
		borderColor: "#4e3526",
	},
	planName: {
		fontSize: 14,
		fontWeight: "600",
		color: "#6B7280",
		marginBottom: 4,
	},
	planNameHighlighted: {
		color: "rgba(255,255,255,0.85)",
	},
	priceRow: {
		flexDirection: "row",
		alignItems: "flex-end",
		gap: 6,
		marginBottom: 4,
	},
	price: {
		fontSize: 36,
		fontWeight: "700",
		color: "#111827",
	},
	priceHighlighted: {
		color: "#FFFFFF",
	},
	priceSuffix: {
		fontSize: 14,
		color: "#6B7280",
		marginBottom: 6,
	},
	priceSuffixHighlighted: {
		color: "rgba(255,255,255,0.8)",
	},
	planDesc: {
		fontSize: 14,
		color: "#6B7280",
		marginBottom: 20,
	},
	planDescHighlighted: {
		color: "rgba(255,255,255,0.85)",
	},
	featuresList: {
		gap: 12,
		marginBottom: 24,
	},
	featureRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	featureText: {
		marginLeft: 8,
		fontSize: 14,
		color: "#111827",
		flex: 1,
	},
	featureTextHighlighted: {
		color: "#FFFFFF",
	},
	button: {
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
	},
	buttonFilled: {
		backgroundColor: "#4e3526",
	},
	buttonOutline: {
		borderWidth: 1,
		borderColor: "#FFFFFF",
		backgroundColor: "transparent",
	},
	buttonText: {
		fontSize: 15,
		fontWeight: "600",
	},
	buttonTextFilled: {
		color: "#FFFFFF",
	},
	buttonTextOutline: {
		color: "#FFFFFF",
	},
});
