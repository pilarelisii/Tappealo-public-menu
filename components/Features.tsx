import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
	QrCode,
	Table2,
	MessageSquare,
	LayoutDashboard,
	FileSpreadsheet,
	Globe,
} from "lucide-react-native";

const features = [
	{
		icon: QrCode,
		title: "Menú digital con QR",
		desc: "Creá un menú digital completo accesible desde un código QR. Platos ilimitados, categorías, imágenes y edición instantánea.",
		bullets: [
			"Platos ilimitados",
			"Categorías de menú",
			"Imágenes de cada plato",
			"Actualización sin reimprimir",
		],
	},
	{
		icon: Table2,
		title: "Gestión de mesas",
		desc: "Gestioná las mesas del restaurante digitalmente con QR único para cada mesa.",
		bullets: [
			"QR único por mesa",
			"Gestión de múltiples mesas",
			"Identificación por mesa",
			"Organización del flujo",
		],
	},
	{
		icon: MessageSquare,
		title: "Comunicación cliente – restaurante",
		desc: "Los clientes se comunican directamente con el personal. Llamar al mozo, pedir la cuenta o enviar mensajes.",
		bullets: [
			"Servicio más rápido",
			"Mejor experiencia",
			"Menos confusión para el personal",
		],
	},
	{
		icon: LayoutDashboard,
		title: "Panel administrador",
		desc: "Cada restaurante tiene un panel de control completo para administrar menú, platos, categorías e imágenes.",
		bullets: [
			"Gestionar menú",
			"Subir imágenes",
			"Configurar datos",
			"Ver solicitudes",
		],
	},
	{
		icon: FileSpreadsheet,
		title: "Carga de menú con Excel",
		desc: "Subí tu menú mediante un archivo Excel. Importá platos automáticamente y cargá el menú completo en minutos.",
		bullets: [
			"Importar automáticamente",
			"Menú completo en minutos",
			"Ahorra horas de trabajo",
		],
	},
	{
		icon: Globe,
		title: "Página propia para cada restaurante",
		desc: "Cada restaurante tiene su propia página: tappealo.com/nombre-del-restaurante.",
		bullets: [
			"URL personalizada",
			"Acceso por link o QR",
			"Presencia digital propia",
		],
	},
];

const Features = () => {
	return (
		<View style={styles.section}>
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.eyebrow}>Funcionalidades</Text>
					<Text style={styles.title}>Todo lo que tu restaurante necesita</Text>
				</View>

				<View style={styles.grid}>
					{features.map((f, i) => {
						const Icon = f.icon;

						return (
							<View key={i} style={styles.card}>
								<View style={styles.iconBox}>
									<Icon size={22} color="#4e3526" />
								</View>

								<Text style={styles.cardTitle}>{f.title}</Text>
								<Text style={styles.cardDesc}>{f.desc}</Text>

								<View style={styles.bulletsList}>
									{f.bullets.map((b, j) => (
										<View key={j} style={styles.bulletRow}>
											<View style={styles.bulletDot} />
											<Text style={styles.bulletText}>{b}</Text>
										</View>
									))}
								</View>
							</View>
						);
					})}
				</View>

				<View style={styles.bottomBlock}>
					<Text style={styles.bottomTitle}>
						La experiencia del cliente, reinventada
					</Text>

					<Text style={styles.bottomText}>
						Tus clientes escanean el QR desde su mesa y acceden al menú completo
						en segundos. Sin descargas, sin esperas, sin complicaciones.
					</Text>

					<Text style={styles.bottomText}>
						Pueden explorar categorías, ver imágenes de cada plato y comunicarse
						con el personal, todo desde su propio celular.
					</Text>
				</View>
			</View>
		</View>
	);
};

export default Features;

const styles = StyleSheet.create({
	section: {
		paddingVertical: 60,
	},
	container: {
		width: "100%",
		alignSelf: "center",
		paddingHorizontal: 16,
		maxWidth: 1200,
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
	grid: {
		gap: 16,
		marginBottom: 50,
	},
	card: {
		backgroundColor: "#FFFFFF",
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#E5E7EB",
		padding: 20,
	},
	iconBox: {
		width: 48,
		height: 48,
		borderRadius: 14,
		backgroundColor: "#F3F4F6",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
	},
	cardTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#111827",
		marginBottom: 8,
	},
	cardDesc: {
		fontSize: 14,
		color: "#6B7280",
		lineHeight: 21,
		marginBottom: 14,
	},
	bulletsList: {
		gap: 8,
	},
	bulletRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	bulletDot: {
		width: 6,
		height: 6,
		borderRadius: 999,
		backgroundColor: "#4e3526",
		marginRight: 10,
		marginTop: 1,
	},
	bulletText: {
		flex: 1,
		fontSize: 14,
		color: "#6B7280",
		lineHeight: 20,
	},
	bottomBlock: {
		maxWidth: 700,
		alignSelf: "center",
	},
	bottomTitle: {
		fontSize: 28,
		fontWeight: "700",
		color: "#111827",
		marginBottom: 16,
		textAlign: "center",
	},
	bottomText: {
		fontSize: 15,
		color: "#6B7280",
		lineHeight: 24,
		textAlign: "center",
		marginBottom: 12,
	},
});
