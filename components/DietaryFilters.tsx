import { useMemo, useState } from "react";
import { Modal, Pressable, View, Text, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export type DietaryRestriction =
  | "vegano"
  | "vegetariano"
  | "sin-tacc"
  | "kosher"
  | "sin-lactosa"
  | "sin-frutos-secos";

interface DietaryFiltersProps {
  selectedFilters: DietaryRestriction[];
  onFilterToggle: (filter: DietaryRestriction) => void;
}

const filterLabels: Record<DietaryRestriction, string> = {
  vegano: "Vegano",
  vegetariano: "Vegetariano",
  "sin-tacc": "Sin TACC",
  kosher: "Kosher",
  "sin-lactosa": "Sin Lactosa",
  "sin-frutos-secos": "Sin Frutos Secos",
};

const allFilters: DietaryRestriction[] = [
  "vegano",
  "vegetariano",
  "sin-tacc",
  "kosher",
  "sin-lactosa",
  "sin-frutos-secos",
];

export function DietaryFilters({ selectedFilters, onFilterToggle }: DietaryFiltersProps) {
  const [open, setOpen] = useState(false);

  const count = useMemo(() => selectedFilters.length, [selectedFilters]);

  return (
    <View>
      <Button
        variant="outline"
        size="sm"
        onPress={() => setOpen(true)}
        className="relative flex-row items-center"
      >
        <Feather name="filter" size={16} style={{ marginRight: 8 }} />
        <Text className="font-semibold">Menú Inteligente</Text>

        {count > 0 && (
          <Badge className="ml-2 h-5 w-5 items-center justify-center p-0 bg-[#4A3428]">
            <Text className="text-xs text-white font-bold">{count}</Text>
          </Badge>
        )}
      </Button>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        {/* Backdrop */}
        <Pressable className="flex-1 bg-black/30" onPress={() => setOpen(false)} />

        {/* “Popover” panel */}
        <View
          className="absolute left-4 top-20 w-80 rounded-xl bg-white p-4 border border-black/10"
          // en web se ve más “popover”; en mobile queda tipo mini-sheet
          style={Platform.OS === "web" ? { boxShadow: "0 10px 30px rgba(0,0,0,0.15)" } as any : undefined}
        >
          <View className="mb-3">
            <Text className="font-semibold mb-1">Filtrá por restricciones</Text>
            <Text className="text-xs opacity-70">Seleccioná tus preferencias alimentarias</Text>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {allFilters.map((filter) => {
              const isSelected = selectedFilters.includes(filter);

              return (
                <Pressable
                  key={filter}
                  onPress={() => onFilterToggle(filter)}
                  className="active:opacity-80"
                >
                  <Badge
                    variant={isSelected ? "default" : "outline"}
                    className={
                      isSelected
                        ? "bg-[#4A3428] border-[#4A3428]"
                        : "bg-transparent"
                    }
                  >
                    <View className="flex-row items-center">
                      {isSelected && (
                        <Feather name="check" size={12} color="#fff" style={{ marginRight: 6 }} />
                      )}
                      <Text className={isSelected ? "text-white text-xs font-semibold" : "text-xs font-semibold"}>
                        {filterLabels[filter]}
                      </Text>
                    </View>
                  </Badge>
                </Pressable>
              );
            })}
          </View>

          <View className="mt-4 flex-row justify-end">
            <Button size="sm" variant="ghost" onPress={() => setOpen(false)}>
              <Text className="font-semibold">Cerrar</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}