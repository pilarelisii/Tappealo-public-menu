import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLanguageContext } from "@/src/i18n/LanguageProvider";

export type OrderStatus =
	| "entrante"
	| "preparacion"
	| "retirar"
	| "falta-pagar"
	| "terminadas";

interface OrderProgressBarProps {
	status: OrderStatus | null;
	deliveryLocation: string | []  | null;
}

export function OrderProgressBar({ status }: OrderProgressBarProps) {
	const { t } = useLanguageContext();

	const pulse = useRef(new Animated.Value(1)).current;

	const steps = [
		{ ids: ["entrante"], label: t.pending, icon: "access-time" as const },
		{ ids: ["preparacion"], label: t.preparing, icon: "soup-kitchen" as const },
		{
			ids: ["retirar", "falta-pagar"],
			label: t.ready,
			icon: "brunch-dining" as const,
		},
		{ ids: ["terminadas"], label: t.delivered, icon: "check" as const },
	];

	const currentIndex = useMemo(() => {
		return steps.findIndex((s) => s.ids.includes(status as OrderStatus));
	}, [status, t]);

	const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;

	const progressValue = useMemo(() => {
		switch (status) {
			case "entrante":
				return 0;
			case "preparacion":
				return 33;
			case "retirar":
			case "falta-pagar":
				return 66;
			case "terminadas":
				return 100;
			default:
				return 0;
		}
	}, [status]);

	useEffect(() => {
		if (status === "terminadas") {
			pulse.stopAnimation();
			pulse.setValue(1);
			return;
		}

		const animation = Animated.loop(
			Animated.sequence([
				Animated.timing(pulse, {
					toValue: 1.12,
					duration: 650,
					easing: Easing.inOut(Easing.ease),
					useNativeDriver: true,
				}),
				Animated.timing(pulse, {
					toValue: 1,
					duration: 650,
					easing: Easing.inOut(Easing.ease),
					useNativeDriver: true,
				}),
			])
		);

		animation.start();

		return () => animation.stop();
	}, [status, pulse]);

	return (
		<View className="w-full gap-3">
			<View className="flex-row justify-between items-center px-1">
				{steps.map((step, index) => {
					const isActive = index <= safeCurrentIndex;
					const isCurrent = index === safeCurrentIndex;
					const shouldAnimate = isCurrent && status !== "terminadas";

					const Circle = (
						<View
							className={`
                w-8 h-8 rounded-full items-center justify-center
                ${isActive ? "bg-primary" : "bg-black/5"}
                ${isCurrent ? "border-2 border-primary" : ""}
              `}
						>
							<MaterialIcons
								name={step.icon as any}
								size={16}
								color={isActive ? "#fff" : "#9CA3AF"}
							/>
						</View>
					);

					return (
						<View key={step.ids.join("-")} className="items-center gap-1">
							{shouldAnimate ? (
								<Animated.View style={{ transform: [{ scale: pulse }] }}>
									{Circle}
								</Animated.View>
							) : (
								Circle
							)}

							<Text
								className={`
                  text-[10px] font-semibold
                  ${isActive ? "text-foreground" : "text-foreground/60"}
                `}
							>
								{step.label}
							</Text>
						</View>
					);
				})}
			</View>

			<View className="h-2 w-full rounded-full bg-black/10 overflow-hidden">
				<View
					className="h-2 bg-primary rounded-full"
					style={{ width: `${Math.max(0, Math.min(100, progressValue))}%` }}
				/>
			</View>
		</View>
	);
}
