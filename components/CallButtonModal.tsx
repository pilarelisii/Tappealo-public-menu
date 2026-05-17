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
import { useLanguageContext } from "@/src/i18n/LanguageProvider";
import { CallType } from "@/src/core/types";

interface RatingModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (type: CallType) => void;
}

export function CallButtonModal({ isOpen, onClose, onSubmit }: RatingModalProps) {
	const { language, changeLanguage, t, ready } = useLanguageContext()
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
			<View className="absolute left-4 right-4 top-52 mx-auto max-w-md rounded-xl gap-4 bg-white p-10 border border-black/10">
				<Text className="text-center text-xl font-semibold text-foreground">
					{t.callWaiterConfirm}
				</Text>

				<View className="mt-5 gap-6">
					<View className="flex-col-reverse gap-3">
						<Button variant="outline" className="flex-1" onPress={onClose}>
							<Text className="font-normal">{t.cancel}</Text>
						</Button>

						<Button variant="default" className="flex-1" onPress={() => onSubmit("bill")}>
							<Text className="font-normal text-white text-md">{t.yesCallCheck}</Text>
						</Button>

						<Button variant="default" className="flex-1" onPress={() => onSubmit("call")}>
							<Text className="font-normal text-white text-md">{t.yesCall}</Text>
						</Button>
					</View>
				</View>
			</View>
		</Modal>
	);
}
