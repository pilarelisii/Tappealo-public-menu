import React from "react";
import { Text, TextProps } from "react-native";

export interface LabelProps extends TextProps {
  className?: string;
}

export function Label({ className = "", ...props }: LabelProps) {
  return (
    <Text
      {...props}
      className={["text-sm font-medium", className].join(" ")}
    />
  );
}