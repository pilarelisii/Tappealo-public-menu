import React from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";


const Index = () => {
	return (
		<View className="flex-1 bg-background items-center justify-center px-6">
			<View className="items-center gap-4">
				<Feather name="alert-circle" size={56} className="text-accent" />

				<Text className="text-2xl font-bold text-foreground text-center">
					Página no encontrada
				</Text>

				<Text className="text-base text-muted-foreground text-center">
					El restaurante o la página que buscás no existe o fue removida.
				</Text>
			</View>
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
