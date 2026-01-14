import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  View,
  Text,
  Platform,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: RatingData) => void;
}

export interface RatingData {
  stars: number;
  improvements: string[];
  comments: string;
}

const improvementOptions: ImprovementOption[] = [
  { id: "speed", label: "Velocidad", icon: "clock" },
  { id: "value", label: "Precio", icon: "dollar-sign" },
  { id: "quality", label: "Calidad", icon: "award" },
  { id: "cleanliness", label: "Limpieza", icon: "sparkle" },
];

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

type ImprovementIcon = "clock" | "dollar-sign" | "award" | "sparkle";

interface ImprovementOption {
  id: "speed" | "value" | "quality" | "cleanliness";
  label: string;
  icon: ImprovementIcon;
}

const ICON_MAP: Record<ImprovementIcon, FeatherIconName> = {
  clock: "clock",
  "dollar-sign": "dollar-sign",
  award: "award",
  sparkle: "zap",
};

export function RatingModal({ isOpen, onClose, onSubmit }: RatingModalProps) {
  const [stars, setStars] = useState(0);
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>([]);
  const [comments, setComments] = useState("");

  // Hover solo web (opcional)
  const [hoveredStar, setHoveredStar] = useState(0);
  const activeStars = useMemo(() => hoveredStar || stars, [hoveredStar, stars]);

  const reset = () => {
    setStars(0);
    setHoveredStar(0);
    setSelectedImprovements([]);
    setComments("");
  };

  const toggleImprovement = (id: string) => {
    setSelectedImprovements((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      stars,
      improvements: selectedImprovements,
      comments,
    });
    reset();
    onClose();
  };

  const handleSkip = () => {
    reset();
    onClose();
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      {/* Backdrop */}
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />

      {/* Dialog */}
      <View className="absolute left-4 right-4 top-24 mx-auto max-w-md rounded-2xl bg-white p-5 border border-black/10">
        <Text className="text-center text-2xl font-semibold">
          Calificá tu experiencia
        </Text>

        <View className="mt-5 gap-6">
          {/* Star rating */}
          <View className="flex-row justify-center gap-2">
            {[1, 2, 3, 4, 5].map((r) => {
              const filled = r <= activeStars;
              return (
                <Pressable
                  key={r}
                  onPress={() => setStars(r)}
                  onHoverIn={Platform.OS === "web" ? () => setHoveredStar(r) : undefined}
                  onHoverOut={Platform.OS === "web" ? () => setHoveredStar(0) : undefined}
                  className="active:opacity-80"
                  hitSlop={8}
                >
                  <Feather
                    name="star"
                    size={44}
                    // “accent” similar al zip: fill-accent text-accent
                    color={filled ? "#d1949e" : "#9CA3AF"}
                  />
                </Pressable>
              );
            })}
          </View>

          {/* Improvement options (stars 1..4) */}
          {stars > 0 && stars < 5 && (
            <View className="gap-3">
              <Text className="text-center text-lg font-semibold">
                ¿Qué podemos mejorar?
              </Text>

              <View className="flex-row flex-wrap justify-between">
                {improvementOptions.map((opt) => {
                  const isSelected = selectedImprovements.includes(opt.id);

                  return (
                    <Pressable
                      key={opt.id}
                      onPress={() => toggleImprovement(opt.id)}
                      className="items-center gap-2 w-[23%] active:opacity-80"
                    >
                      <View
                        className={[
                          "w-16 h-16 rounded-full items-center justify-center border",
                          isSelected
                            ? "bg-[#d1949e] border-[#d1949e]"
                            : "bg-black/5 border-black/10",
                        ].join(" ")}
                      >
                        <Feather
                          name={ICON_MAP[opt.icon]}
                          size={28}
                          color={isSelected ? "#fff" : "#6B7280"}
                        />
                      </View>
                      <Text className="text-sm opacity-70">{opt.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Comments */}
          {stars > 0 && (
            <View className="gap-2">
              <View className="flex-row items-center justify-center gap-2">
                <Text className="text-sm opacity-70">Contanos más</Text>
              </View>

              {/* Usá tu primitive Textarea. Si no la tenés, te paso una. */}
              <Textarea
                placeholder="Dejanos tus comentarios (opcional)"
                value={comments}
                onChangeText={setComments}
                numberOfLines={3}
              />
            </View>
          )}

          {/* Actions */}
          <View className="flex-row gap-3">
            <Button variant="outline" className="flex-1" onPress={handleSkip}>
              <Text className="font-semibold">Omitir</Text>
            </Button>

            <Button
              variant="secondary"
              className="flex-1"
              onPress={handleSubmit}
              disabled={stars === 0}
            >
              <Text className="font-semibold">Enviar</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}