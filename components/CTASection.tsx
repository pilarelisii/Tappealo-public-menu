import React from "react";
import {
	View,
	Text,
	StyleSheet,
	ImageBackground,
	Pressable,
	Linking,
} from "react-native";
import { ArrowRight } from "lucide-react-native";

const heroRestaurant = require("@/assets/images/hero-restaurant.jpg");

const CTASection = () => {
	const openDemo = () => {
		Linking.openURL(
			"https://wa.me/5492213519098?text=Hola,%20quiero%20saber%20mas%20sobre%20Tappealo!"
		);
	};

	return (
		<ImageBackground
			source={heroRestaurant}
			style={styles.section}
			resizeMode="cover"
		>
			<View style={styles.overlay} />

			<View style={styles.container}>
				<Text style={styles.title}>
					Llevá tu restaurante al siguiente nivel
				</Text>

				<Text style={styles.desc}>
					Descubrí cómo Tappealo puede mejorar la experiencia de tus clientes y
					optimizar tu operación.
				</Text>

				<Pressable style={styles.button} onPress={openDemo}>
					<Text style={styles.buttonText}>Solicitar demo</Text>
					<ArrowRight size={18} color="#fff" style={{ marginLeft: 6 }} />
				</Pressable>
			</View>
		</ImageBackground>
	);
};

export default CTASection;

const styles = StyleSheet.create({
	section: {
		height: 420,
		paddingVertical: 80,
		justifyContent: "center",
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.75)",
	},
	container: {
		paddingHorizontal: 20,
		alignItems: "center",
		zIndex: 2,
	},
	title: {
		fontSize: 32,
		fontWeight: "700",
		color: "#fff",
		textAlign: "center",
		marginBottom: 12,
	},
	desc: {
		fontSize: 18,
		color: "rgba(255,255,255,0.8)",
		textAlign: "center",
		maxWidth: 500,
		marginBottom: 24,
		lineHeight: 26,
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#4e3526",
		paddingVertical: 14,
		paddingHorizontal: 22,
		borderRadius: 10,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 16,
	},
});
