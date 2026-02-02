import { useMemo, useState } from "react";
import {
	Modal,
	Pressable,
	View,
	Text,
	Platform,
	TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface RatingModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: () => void;
}

export function CallButtonModal({ isOpen, onClose, onSubmit }: RatingModalProps) {

	return (
		<Modal
			visible={isOpen}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			{/* Backdrop */}
			<Pressable className="flex-1 bg-black/20" onPress={onClose} />

			{/* Dialog */}
			<View className="absolute left-4 right-4 top-52 mx-auto max-w-md rounded-2xl gap-4 bg-white p-10 border border-black/10">
				<Text className="text-center text-xl font-semibold text-foreground">
					¿Seguro que querés llamar al mozo?
				</Text>

				<View className="mt-5 gap-6">
					<View className="flex-row gap-3">
						<Button variant="outline" className="flex-1" onPress={onClose}>
							<Text className="font-semibold">Cancelar</Text>
						</Button>

						<Button variant="default" className="flex-1" onPress={onSubmit}>
							<Text className="font-semibold text-white">Si, llamar</Text>
						</Button>
					</View>
				</View>
			</View>
		</Modal>
	);
}
