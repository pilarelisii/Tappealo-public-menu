import "../style/global.css";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { LanguageProvider } from "@/src/i18n/LanguageProvider";

export const unstable_settings = {
  anchor: "[slug]",
};

export default function RootLayout() {
  return (
    <LanguageProvider>
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(slug)" />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
    </LanguageProvider>
  );
}