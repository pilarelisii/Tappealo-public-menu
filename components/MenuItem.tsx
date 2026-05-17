import { Feather } from "@expo/vector-icons";
import { Text, View , Pressable} from "react-native";
import { useState } from "react";
import { AppImage } from "./ui/AppImage";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useLanguageContext } from "@/src/i18n/LanguageProvider";

export interface MenuItemType {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  enabled: boolean;
}

interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: (item: MenuItemType) => void;
  cartQuantity?: number;
  active: boolean;
}

export function MenuItem({ item, onAddToCart, cartQuantity = 0, active }: MenuItemProps) {
  const { language, changeLanguage, t, ready } = useLanguageContext()
  const [expanded, setExpanded] = useState(false);

  return (
		<Card className="overflow-hidden border-border">
			<CardContent className="p-4 pt-4">
				<View className="flex-row gap-4">
					{item?.image ? (
						<View className="relative overflow-hidden rounded-lg shrink-0 w-[100px] h-[100px]">
							<AppImage
								uri={item.image}
								style={{ width: "100%", height: "100%" }}
							/>
						</View>
					) : null}

					<View className="flex-1 justify-between min-w-0">
						<View>
							<View className="flex-row items-start justify-between gap-2">
								<View className="flex-col gap-2 flex-1 min-w-0 h-auto">
									<Text
										className="font-bold text-foreground text-lg"
										numberOfLines={3}
									>
										{item.name}
									</Text>
								</View>

								<Text className="font-bold text-foreground text-sm">
									{`$${Number(item.price).toLocaleString("es-AR")}`}
								</Text>
							</View>

							{!!item.description && (
								<View>
									<Text
										className="text-sm text-muted-foreground mt-1"
										numberOfLines={expanded ? undefined : 2}
										style={{ flexShrink: 1 }}
									>
										{item.description}
									</Text>

									{item.description.length > 44 && (
										<Pressable onPress={() => setExpanded((p) => !p)}>
											<Text className="text-primary text-sm mt-1 font-medium">
												{expanded ? "Leer menos" : "Leer más"}
											</Text>
										</Pressable>
									)}
								</View>
							)}
						</View>

						<View className="flex-row justify-end mt-2">
							<View className="relative">
								{active && (
									<Button
										variant="menu"
										size="sm"
										onPress={() => onAddToCart(item)}
										className="flex-row items-center gap-2"
									>
										<Feather name="plus" size={16} />
										<Text className="font-semibold">{t.add}</Text>
									</Button>
								)}

								{cartQuantity > 0 ? (
									<Badge className="absolute -top-2 -right-2 h-5 w-5 items-center justify-center p-0 bg-green-500 border border-green-600">
										<Text className="text-xs text-white font-bold">
											{cartQuantity}
										</Text>
									</Badge>
								) : null}
							</View>
						</View>
					</View>
				</View>
			</CardContent>
		</Card>
	);
}