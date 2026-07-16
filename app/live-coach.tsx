import { Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function LiveCoachScreen() {
  const colors = useColors();
  const [isActive, setIsActive] = useState(false);

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>실시간 AI 코칭</Text>
        <View style={{ marginLeft: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: isActive ? `${colors.success}20` : `${colors.muted}20` }}>
          <Text style={{ fontSize: 11, color: isActive ? colors.success : colors.muted, fontWeight: "600" }}>{isActive ? "● LIVE" : "대기중"}</Text>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: isActive ? `${colors.primary}20` : colors.surface, borderWidth: 3, borderColor: isActive ? colors.primary : colors.border, justifyContent: "center", alignItems: "center", marginBottom: 24 }}>
          <IconSymbol name={isActive ? "waveform" : "mic.fill"} size={48} color={isActive ? colors.primary : colors.muted} />
        </View>
        <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground, marginBottom: 8 }}>
          {isActive ? "코칭 중..." : "실시간 발표 코칭"}
        </Text>
        <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center", lineHeight: 22, marginBottom: 32 }}>
          {isActive ? "AI가 실시간으로 발표를 분석하고 있습니다" : "시작 버튼을 누르면 AI가 실시간으로\n발표를 분석하고 피드백을 제공합니다"}
        </Text>
        <TouchableOpacity
          onPress={handleToggleCoaching}
          style={{ backgroundColor: isActive ? colors.error : colors.primary, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 40 }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.background }}>
            {isActive ? "코칭 종료" : "코칭 시작"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
