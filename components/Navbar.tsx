import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	Pressable,
	Linking,
} from "react-native";
import { Menu, X } from "lucide-react-native";

const logo = require("@/assets/images/tappealo-logo.png");

// type NavbarProps = {
// 	scrollToSection: (section: string) => void;
// };

const Navbar = () => {
	const [open, setOpen] = useState(false);

	const links = [
		{ label: "Cómo funciona", key: "como-funciona" },
		{ label: "Funcionalidades", key: "funcionalidades" },
		{ label: "Precios", key: "precios" },
		{ label: "FAQ", key: "faq" },
	];

	// const handlePress = (key: string) => {
	// 	setOpen(false);
	// 	scrollToSection(key);
	// };

	return (
		<View style={styles.nav}>
			<View style={styles.container}>
				<Image source={logo} style={styles.logo} resizeMode="contain" />

				{/* <Pressable onPress={() => setOpen(!open)}>
					{open ? (
						<X size={24} color="#111827" />
					) : (
						<Menu size={24} color="#111827" />
					)}
				</Pressable> */}
			</View>

			{/* {open && (
				<View style={styles.mobileMenu}>
					{links.map((l) => (
						<Pressable
							key={l.key}
							onPress={() => handlePress(l.key)}
							style={styles.linkWrap}
						>
							<Text style={styles.link}>{l.label}</Text>
						</Pressable>
					))}

					<Pressable
						style={styles.button}
						onPress={() => Linking.openURL("https://w.app/fij1pn")}
					>
						<Text style={styles.buttonText}>Solicitar demo</Text>
					</Pressable>
				</View>
			)} */}
		</View>
	);
};

export default Navbar;

const styles = StyleSheet.create({
	nav: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 50,
		backgroundColor: "rgba(255,255,255,0.95)",
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
	},
	container: {
		height: 64,
		paddingHorizontal: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	logo: {
		width: 140,
		height: 50,
	},
	mobileMenu: {
		paddingHorizontal: 16,
		paddingBottom: 16,
		borderTopWidth: 1,
		borderTopColor: "#E5E7EB",
		backgroundColor: "#FFFFFF",
	},
	linkWrap: {
		paddingVertical: 12,
	},
	link: {
		fontSize: 14,
		color: "#6B7280",
	},
	button: {
		marginTop: 8,
		backgroundColor: "#C99700",
		borderRadius: 10,
		paddingVertical: 14,
		alignItems: "center",
	},
	buttonText: {
		color: "#FFFFFF",
		fontWeight: "600",
	},
});
