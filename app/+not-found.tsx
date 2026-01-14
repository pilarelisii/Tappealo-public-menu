import { View, Text } from "react-native";
import { Link } from "expo-router";
import { Button } from "@/components/ui/button";
import { Feather } from "@expo/vector-icons";

export default function NotFoundScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      <View className="items-center gap-4">
        <Feather name="alert-circle" size={56} className="text-accent" />

        <Text className="text-2xl font-bold text-foreground text-center">
          Página no encontrada
        </Text>

        <Text className="text-base text-muted-foreground text-center">
          El restaurante o la página que buscás no existe o fue removida.
        </Text>

      </View>
    </View>
  );
}