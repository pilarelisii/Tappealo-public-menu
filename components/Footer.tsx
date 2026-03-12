import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

const logo = require("@/assets/images/tappealo-logo.png");

const Footer = () => {
	return (
		<View style={styles.footer}>
			<View style={styles.container}>
				<View style={styles.top}>
					<View style={styles.logoRow}>
						<Image source={logo} style={styles.logo} resizeMode="contain" />
						<Text style={styles.tagline}>
							El sistema digital para restaurantes
						</Text>
					</View>

					<View style={styles.links}>
						<Pressable>
							<Text style={styles.link}>Cómo funciona</Text>
						</Pressable>

						<Pressable>
							<Text style={styles.link}>Funcionalidades</Text>
						</Pressable>

						<Pressable>
							<Text style={styles.link}>Precios</Text>
						</Pressable>

						<Pressable>
							<Text style={styles.link}>FAQ</Text>
						</Pressable>
					</View>
				</View>

				<View style={styles.bottom}>
					<Text style={styles.copy}>
						© 2026 Tappealo. Todos los derechos reservados.
					</Text>
				</View>
			</View>
		</View>
	);
};

export default Footer;

const styles = StyleSheet.create({
	footer: {
		borderTopWidth: 1,
		borderTopColor: "#E5E7EB",
		backgroundColor: "#FFFFFF",
		paddingVertical: 40,
	},
	container: {
		paddingHorizontal: 16,
		maxWidth: 1100,
		alignSelf: "center",
		width: "100%",
	},
	top: {
		alignItems: "center",
		gap: 20,
	},
	logoRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	logo: {
		height: 40,
		width: 40,
		marginRight: 10,
	},
	tagline: {
		fontSize: 14,
		color: "#6B7280",
	},
	links: {
		flexDirection: "row",
		gap: 20,
	},
	link: {
		fontSize: 14,
		color: "#6B7280",
	},
	bottom: {
		marginTop: 30,
		paddingTop: 20,
		borderTopWidth: 1,
		borderTopColor: "#E5E7EB",
		alignItems: "center",
	},
	copy: {
		fontSize: 12,
		color: "#9CA3AF",
	},
});
