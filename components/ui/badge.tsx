import React from "react";
import { View, ViewProps } from "react-native";

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ variant = "default", className = "", ...props }: BadgeProps) {
  const base =
    "items-center rounded-full border px-2.5 py-0.5";

  const variants: Record<BadgeVariant, string> = {
    default: "border-transparent bg-primary",
    secondary: "border-transparent bg-secondary",
    destructive: "border-transparent bg-destructive",
    outline: "bg-transparent border border-black/10",
  };

  return (
    <View className={[base, variants[variant], className].join(" ")} {...props} />
  );
}