import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { ChevronDown } from "lucide-react-native";

const faqs = [
	{
		q: "¿Necesito conocimientos técnicos para usar Tappealo?",
		a: "No. Tappealo está diseñado para que cualquier persona pueda configurar su restaurante en minutos. Solo necesitás acceso a internet.",
	},
	{
		q: "¿Puedo actualizar el menú en cualquier momento?",
		a: "Sí. Podés agregar, editar o eliminar platos desde el panel administrador en tiempo real. Los cambios se reflejan al instante en el menú digital.",
	},
	{
		q: "¿Cómo funcionan los códigos QR?",
		a: "Cada mesa tiene un código QR único. Cuando un cliente lo escanea con su celular, se abre automáticamente el menú digital de tu restaurante.",
	},
	{
		q: "¿Los clientes necesitan descargar alguna app?",
		a: "No. El menú se abre directamente en el navegador del celular. No se necesita ninguna descarga.",
	},
	{
		q: "¿Puedo cargar mi menú desde un archivo Excel?",
		a: "Sí. Podés importar todos tus platos desde un archivo Excel para ahorrar tiempo en la carga inicial.",
	},
	{
		q: "¿Qué pasa si necesito más mesas que las de mi plan?",
		a: "Podés actualizar tu plan en cualquier momento para agregar más mesas. El cambio es inmediato.",
	},
];

const FAQ = () => {
	const [open, setOpen] = useState<number | null>(null);

	return (
		<View style={styles.section}>
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.eyebrow}>FAQ</Text>
					<Text style={styles.title}>Preguntas frecuentes</Text>
				</View>

				<View style={styles.list}>
					{faqs.map((f, i) => {
						const isOpen = open === i;

						return (
							<View key={i} style={styles.card}>
								<Pressable
									style={styles.question}
									onPress={() => setOpen(isOpen ? null : i)}
								>
									<Text style={styles.questionText}>{f.q}</Text>

									<ChevronDown
										size={18}
										color="#6B7280"
										style={{
											transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
										}}
									/>
								</Pressable>

								{isOpen && <Text style={styles.answer}>{f.a}</Text>}
							</View>
						);
					})}
				</View>
			</View>
		</View>
	);
};

export default FAQ;

const styles = StyleSheet.create({
	section: {
		paddingVertical: 60,
	},
	container: {
		paddingHorizontal: 16,
		maxWidth: 800,
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
		fontSize: 32,
		fontWeight: "700",
		textAlign: "center",
		color: "#111827",
	},
	list: {
		gap: 12,
	},
	card: {
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 12,
		backgroundColor: "#FFFFFF",
		overflow: "hidden",
	},
	question: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
	},
	questionText: {
		flex: 1,
		fontSize: 15,
		fontWeight: "500",
		color: "#111827",
		marginRight: 10,
	},
	answer: {
		paddingHorizontal: 16,
		paddingBottom: 16,
		fontSize: 14,
		color: "#6B7280",
		lineHeight: 20,
	},
});
