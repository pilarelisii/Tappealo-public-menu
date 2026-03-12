import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
	ScanLine,
	BookOpen,
	LayoutGrid,
	MessageCircle,
	Settings,
} from "lucide-react-native";

const steps = [
	{
		icon: ScanLine,
		title: "Escanea el QR",
		desc: "El cliente escanea el código QR de la mesa",
	},
	{
		icon: BookOpen,
		title: "Menú digital",
		desc: "Se abre el menú digital automáticamente",
	},
	{
		icon: LayoutGrid,
		title: "Explora el menú",
		desc: "El cliente puede ver categorías y platos",
	},
	{
		icon: MessageCircle,
		title: "Comunicación",
		desc: "El cliente puede comunicarse con el restaurante",
	},
	{
		icon: Settings,
		title: "Panel admin",
		desc: "El restaurante gestiona todo desde el panel administrador",
	},
];

const HowItWorks = () => {
	return (
		<View style={styles.section}>
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.eyebrow}>Cómo funciona</Text>
					<Text style={styles.title}>Simple, rápido y efectivo</Text>
				</View>

				<View style={styles.timeline}>
					{steps.map((step, i) => {
						const Icon = step.icon;

						return (
							<View key={i} style={styles.stepRow}>
								<View style={styles.iconColumn}>
									<View style={styles.iconBox}>
										<Icon size={24} color="#fff" />
									</View>

									{i < steps.length - 1 && <View style={styles.line} />}
								</View>

								<View style={styles.textColumn}>
									<Text style={styles.stepTitle}>{step.title}</Text>
									<Text style={styles.stepDesc}>{step.desc}</Text>
								</View>
							</View>
						);
					})}
				</View>
			</View>
		</View>
	);
};

export default HowItWorks;

const styles = StyleSheet.create({
	section: {
		paddingVertical: 60,
		backgroundColor: "#FFFFFF",
	},
	container: {
		paddingHorizontal: 16,
		maxWidth: 900,
		alignSelf: "center",
		width: "100%",
	},
	header: {
		alignItems: "center",
		marginBottom: 40,
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
	timeline: {
		marginTop: 10,
	},
	stepRow: {
		flexDirection: "row",
		marginBottom: 28,
	},
	iconColumn: {
		alignItems: "center",
		marginRight: 18,
	},
	iconBox: {
		width: 56,
		height: 56,
		borderRadius: 16,
		backgroundColor: "#4e3526",
		justifyContent: "center",
		alignItems: "center",
	},
	line: {
		width: 2,
		height: 48,
		backgroundColor: "#E5E7EB",
		marginTop: 6,
	},
	textColumn: {
		flex: 1,
		paddingTop: 6,
	},
	stepTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#111827",
		marginBottom: 4,
	},
	stepDesc: {
		fontSize: 14,
		color: "#6B7280",
		lineHeight: 20,
	},
});
