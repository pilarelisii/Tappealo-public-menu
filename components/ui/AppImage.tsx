import { Image, type ImageProps } from "expo-image";
import { StyleProp, ImageStyle } from "react-native";

type Props = {
  uri?: string;
  source?: ImageProps["source"];   // soporta require(...) o { uri }
  style?: StyleProp<ImageStyle>;
  contentFit?: ImageProps["contentFit"];
  transition?: number;
};

export function AppImage({
  uri,
  source,
  style,
  contentFit = "cover",
  transition = 150,
}: Props) {
  const finalSource = source ?? (uri ? { uri } : undefined);

  return (
    <Image
      source={finalSource}
      style={style}
      contentFit={contentFit}
      transition={transition}
    />
  );
}