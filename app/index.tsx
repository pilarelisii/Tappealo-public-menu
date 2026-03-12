import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Benefits from "@/components/Benefits";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
	return (
		<View style={styles.container}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.content}
			>
				<Navbar />
				<HeroSection />
				<HowItWorks />
				<Features />
				<Pricing />
				<FAQ />
				<CTASection />
				<Footer />
			</ScrollView>
		</View>
	);
};

export default Index;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	content: {
		paddingBottom: 30,
	},
});
