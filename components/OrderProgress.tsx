import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

export type OrderStatus = "pending" | "preparing" | "ready" | "completed";

interface OrderProgressBarProps {
  status: OrderStatus;
}

const steps = [
  { id: "pending" as const, label: "Pendiente", icon: "clock" as const },
  { id: "preparing" as const, label: "Preparando", icon: "coffee" as const }, // o "tool"
  { id: "ready" as const, label: "Listo", icon: "package" as const },
  { id: "completed" as const, label: "Entregado", icon: "check" as const },
];

const getProgressValue = (status: OrderStatus): number => {
  switch (status) {
    case "pending":
      return 0;
    case "preparing":
      return 33;
    case "ready":
      return 66;
    case "completed":
      return 100;
    default:
      return 0;
  }
};

export function OrderProgressBar({ status }: OrderProgressBarProps) {
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
                <Feather
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