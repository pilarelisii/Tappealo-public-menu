import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

interface HowToUseModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function HowToUseModal({ isOpen, onClose }: HowToUseModalProps) {
	return (
		<Modal visible={isOpen} transparent animationType="fade">
			<View className="flex-1 items-center justify-center bg-black/50 px-5">
				<View className="w-full max-w-md rounded-2xl bg-white p-6">
					<View className="mb-4 flex-row items-center justify-between">
						<View>
							<Text className="text-lg font-bold text-foreground">
								¿Cómo usar Tappealo?
							</Text>
							<Text className="mt-1 text-sm text-neutral-500">
								Pedí desde tu mesa en pocos pasos
							</Text>
						</View>

						<Pressable
							onPress={onClose}
							className="rounded-full bg-neutral-100 p-1"
						>
							<Feather name="x" size={18} color="#171717" />
						</Pressable>
					</View>

					<View className="gap-4">
						<Step
							number="1"
							title="Elegí tus productos"
							description="Agregá al carrito todo lo que quieras pedir."
						/>

						<Step
							number="2"
							title="Completá tus datos"
							description="Ingresá tu nombre y los datos necesarios."
						/>

						<Step
							number="3"
							title="Elegí cómo pagar"
							description="Seleccioná el método de pago disponible."
						/>

						<Step
							number="4"
							title="Confirmá el pedido"
							description="El restaurante recibirá tu pedido al instante."
						/>
					</View>

					<Pressable
						onPress={onClose}
						className="mt-6 rounded-xl bg-foreground py-3"
					>
						<Text className="text-center text-base font-semibold text-white">
							Entendido
						</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
}

interface StepProps {
	number: string;
	title: string;
	description: string;
}

function Step({ number, title, description }: StepProps) {
	return (
		<View className="flex-row gap-3">
			<View className="h-8 w-8 items-center justify-center rounded-full bg-foreground">
				<Text className="font-bold text-white">{number}</Text>
			</View>

			<View className="flex-1">
				<Text className="text-base font-semibold text-foreground">
					{title}
				</Text>
				<Text className="mt-1 text-sm leading-5 text-neutral-500">
					{description}
				</Text>
			</View>
		</View>
	);
}
