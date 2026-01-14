import React from "react";
import { TextInput, TextInputProps } from "react-native";

export interface TextareaProps extends TextInputProps {
  className?: string;
}

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <TextInput
      {...props}
      multiline
      textAlignVertical="top"
      placeholderTextColor="#9CA3AF"
      className={[
        "min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        className,
      ].join(" ")}
    />
  );
}