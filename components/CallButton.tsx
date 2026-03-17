import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Button } from "./ui/button";
export function CallButton({onCallButton, active} : {
    onCallButton: () => void
    active: boolean
}) {
	return (
		<Button className={`absolute bg-accent/40 ${active ? "bottom-28" : "bottom-16"} left-4 w-12 h-12 rounded-[100%] shadow`} onPress={onCallButton}>
			<FontAwesome6 name="bell-concierge" size={26} className=" text-accent" />
		</Button>
	);
}
