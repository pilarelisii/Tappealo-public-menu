import React from "react";
import { TextInput, TextInputProps, Platform } from "react-native";

export interface InputProps extends TextInputProps {
  className?: string;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ className = "", editable = true, style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        editable={editable}
        placeholderTextColor="#9CA3AF"
        {...props}
        className={[
          "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base",
          !editable ? "opacity-50" : "",
          className,
        ].join(" ")}
        style={[
          Platform.select({
            web: {
              outlineStyle: "none",
            },
          }) as any,
          style,
        ]}
      />
    );
  },
);

Input.displayName = "Input";