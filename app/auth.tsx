import { Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function AuthScreen() {
  const colors = useColors();

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ position: "absolute", top: 16, left: 20 }}>
          <IconSymbol name="xmark" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
          <IconSymbol name="mic.fill" size={32} color={colors.background} />
        </View>
        <Text style={{ fontSize: 26, fontWeight: "800", color: colors.foreground, marginBottom: 8 }}>
          SayUp<Text style={{ color: colors.primary }}>AI</Text>
        </Text>
        <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center", marginBottom: 40, lineHeight: 22 }}>
          {"로그인하고 AI 발표 코치를\n무료로 시작해보세요"}
        </Text>
        {[
          { label: "Google로 계속하기", icon: "envelope.fill" as const },
          { label: "Apple로 계속하기", icon: "lock.fill" as const },
        ].map((btn, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {}}
            style={{ width: "100%", backgroundColor: i === 0 ? colors.foreground : colors.surface, borderRadius: 12, paddingVertical: 14, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 10, marginBottom: 12, borderWidth: i === 1 ? 1 : 0, borderColor: colors.border }}
            activeOpacity={0.8}
          >
            <IconSymbol name={btn.icon} size={18} color={i === 0 ? colors.background : colors.foreground} />
            <Text style={{ fontSize: 15, fontWeight: "600", color: i === 0 ? colors.background : colors.foreground }}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
        <Text style={{ fontSize: 12, color: colors.mutedDark, textAlign: "center", marginTop: 16, lineHeight: 18 }}>
          {"계속 진행하면 이용약관 및\n개인정보처리방침에 동의하게 됩니다"}
        </Text>
      </View>
    </ScreenContainer>
  );
}
