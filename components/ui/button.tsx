import React from "react";
import { Pressable, Text, View, PressableProps, ViewStyle } from "react-native";

type Variant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "menu";

type Size = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends Omit<PressableProps, "children"> {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

const base =
  "flex-row items-center justify-center gap-2 rounded-md";

const variants: Record<Variant, string> = {
  default: "bg-primary",
  destructive: "bg-destructive",
  outline: "border border-input bg-background",
  secondary: "bg-secondary",
  ghost: "bg-transparent",
  link: "bg-transparent",
  menu: "bg-accent",
};

const sizes: Record<Size, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  lg: "h-11 px-8",
  icon: "h-10 w-10 p-0",
};

const textVariants: Record<Variant, string> = {
  default: "text-primary-foreground",
  destructive: "text-destructive-foreground",
  outline: "text-foreground",
  secondary: "text-secondary-foreground",
  ghost: "text-foreground",
  link: "text-primary underline",
  menu: "text-accent-foreground",
};

export function Button({
  variant = "default",
  size = "default",
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      className={[
        base,
        variants[variant],
        sizes[size],
        disabled ? "opacity-50" : "opacity-100",
        className,
      ].join(" ")}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className={["text-sm font-medium", textVariants[variant]].join(" ")}>
          {children}
        </Text>
      ) : (
        // si el caller mete <Text> adentro (como venimos haciendo), lo respeta
        children
      )}
    </Pressable>
  );
}