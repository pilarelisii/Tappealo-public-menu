import React, { useEffect, useMemo } from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLanguageContext } from "@/src/i18n/LanguageProvider";

export type OrderStatus = 'entrante' | 'preparacion' | 'retirar' | 'enviar' | 'terminadas';

interface OrderProgressBarProps {
  status: OrderStatus | [] | null;
  deliveryLocation: string | [] | null;
}





export function OrderProgressBar({ status, deliveryLocation }: OrderProgressBarProps) {
  const { language, changeLanguage, t, ready } = useLanguageContext()
  const delivery = (deliveryLocation === 'envio') ? 'enviar' : 'retirar';
  const steps = [
    { id: "entrante" as const, label: t.pending, icon: "access-time" as const },
    { id: "preparacion" as const, label: t.preparing, icon: "soup-kitchen" as const }, // o "tool"
    { id: delivery, label: t.ready, icon: "local-restaurante" },
    { id: "terminadas" as const, label: t.delivered, icon: "check" as const },
  ];
    const getProgressValue = (status: OrderStatus | [] | null): number => {
    switch (status) {
      case "entrante":
        return 0;
      case "preparacion":
        return 33;
      case "retirar":
        return 66;
      case "enviar":
        return 66;
      case "terminadas":
        return 100;
      default:
        return 0;
    }
  };

  const currentIndex = useMemo(
    () => steps.findIndex((s) => s.id === status),
    [status]
  );

  const progressValue = useMemo(() => getProgressValue(status), [status]);
  
  return (
    <View className={"w-full gap-3"}>
      {/* Steps */}
      <View className="flex-row justify-between items-center px-1">
        {steps.map((step, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <View key={step.id} className="items-center gap-1">
              <View
                className={
                  `w-8 h-8 rounded-full items-center justify-center
                  ${isActive ? "bg-primary" : "bg-black/5"}
                  ${isCurrent ? "border-2 border-primary" : ""}`
                }
              >
                <MaterialIcons
                  // @ts-ignore
                  name={step.icon}
                  size={16}
                  color={isActive ? "#fff" : "#9CA3AF"} // gris suave
                />
              </View>

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

      {/* Progress Bar */}
      <View className="h-2 w-full rounded-full bg-black/10 overflow-hidden">
        <View
          className="h-2 bg-primary rounded-full"
          style={{ width: `${Math.max(0, Math.min(100, progressValue))}%` }}
        />
      </View>
    </View>
  );
}