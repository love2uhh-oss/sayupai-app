// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  "house.fill": "home",
  "person.fill": "person",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "mic.fill": "mic",
  "mic": "mic-none",
  "wifi": "wifi",
  "play.fill": "play-arrow",
  "arrow.right": "arrow-forward",
  "crown.fill": "workspace-premium",
  "star.fill": "star",
  "checkmark.circle.fill": "check-circle",
  "xmark.circle.fill": "cancel",
  "xmark": "close",
  "chart.bar.fill": "bar-chart",
  "clock.fill": "access-time",
  "video.fill": "videocam",
  "camera.fill": "camera-alt",
  "camera": "camera-alt",
  "waveform": "graphic-eq",
  "arrow.up.circle.fill": "upload",
  "doc.fill": "description",
  "square.and.arrow.up": "share",
  "arrow.down.circle.fill": "download",
  "exclamationmark.triangle.fill": "warning",
  "info.circle.fill": "info",
  "gear": "settings",
  "trash.fill": "delete",
  "plus.circle.fill": "add-circle",
  "minus.circle.fill": "remove-circle",
  "magnifyingglass": "search",
  "bell.fill": "notifications",
  "envelope.fill": "email",
  "lock.fill": "lock",
  "eye.fill": "visibility",
  "eye.slash.fill": "visibility-off",
  "gift.fill": "card-giftcard",
  "tag.fill": "local-offer",
  "trophy.fill": "emoji-events",
  "lightbulb.fill": "lightbulb",
  "target": "gps-fixed",
  "arrow.clockwise": "refresh",
  "ellipsis": "more-horiz",
  "list.bullet": "list",
  "checkmark": "check",
  "minus": "remove",
  "plus": "add",
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
