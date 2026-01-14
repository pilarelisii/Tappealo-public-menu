import React from "react";
import { View, ViewProps, Text, TextProps, Platform } from "react-native";

type CNProps<T> = T & { className?: string };

export function Card({ className = "", style, ...props }: CNProps<ViewProps>) {
  return (
    <View
      {...props}
      className={[
        "rounded-lg border bg-card",
        className,
      ].join(" ")}
      style={[
        // shadow similar a var(--card-shadow)
        Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
          },
          android: { elevation: 3 },
          web: { boxShadow: "0 12px 30px rgba(0,0,0,0.08)" } as any,
        }),
        style as any,
      ]}
    />
  );
}

export function CardHeader({ className = "", ...props }: CNProps<ViewProps>) {
  return <View {...props} className={["flex-col gap-1.5 p-6", className].join(" ")} />;
}

export function CardContent({ className = "", ...props }: CNProps<ViewProps>) {
  return <View {...props} className={["p-6 pt-0", className].join(" ")} />;
}

export function CardFooter({ className = "", ...props }: CNProps<ViewProps>) {
  return <View {...props} className={["flex-row items-center p-6 pt-0", className].join(" ")} />;
}

export function CardTitle({ className = "", ...props }: CNProps<TextProps>) {
  return <Text {...props} className={["text-2xl font-semibold", className].join(" ")} />;
}

export function CardDescription({ className = "", ...props }: CNProps<TextProps>) {
  return <Text {...props} className={["text-sm opacity-70", className].join(" ")} />;
}