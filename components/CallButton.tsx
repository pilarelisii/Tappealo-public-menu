import { View, Text } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Button } from "./ui/button";
export function CallButton({onCallButton} : {
    onCallButton: () => void
}) {
	return (
		<Button className="absolute bg-accent/40 bottom-32 left-4 w-12 h-12 rounded-[100%] shadow" onPress={onCallButton}>
			<FontAwesome6 name="bell-concierge" size={26} className="text-foreground" />
		</Button>
	);
}
