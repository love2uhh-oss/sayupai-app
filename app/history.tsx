import { FlatList, Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

const MOCK_HISTORY = [
  { id: "1", title: "팀 프로젝트 발표", date: "2024.01.15", score: 78, purpose: "팀 보고", duration: "5분 32초" },
  { id: "2", title: "IR 피치 연습", date: "2024.01.10", score: 65, purpose: "IR 피치", duration: "8분 15초" },
  { id: "3", title: "수업 발표 준비", date: "2024.01.05", score: 82, purpose: "수업 발표", duration: "3분 48초" },
];

export default function HistoryScreen() {
  const colors = useColors();

  const getScoreColor = (score: number) => score >= 80 ? colors.success : score >= 60 ? colors.warning : colors.error;

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>분석 기록</Text>
      </View>
      <View style={{ flexDirection: "row", gap: 12, padding: 20, paddingBottom: 0 }}>
        {[
          { label: "총 분석", value: MOCK_HISTORY.length.toString() },
          { label: "평균 점수", value: Math.round(MOCK_HISTORY.reduce((a, b) => a + b.score, 0) / MOCK_HISTORY.length).toString() },
          { label: "이번 달", value: "2" },
        ].map((stat, i) => (
          <View key={i} style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14, alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: colors.primary }}>{stat.value}</Text>
            <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>{stat.label}</Text>
          </View>
        ))}
      </View>
      <FlatList
        data={MOCK_HISTORY}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push("/sample")}
            style={{ backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16 }}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground, marginBottom: 4 }}>{item.title}</Text>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <Text style={{ fontSize: 12, color: colors.muted }}>{item.date}</Text>
                  <Text style={{ fontSize: 12, color: colors.muted }}>{item.duration}</Text>
                </View>
                <View style={{ marginTop: 8, alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: colors.surface2 }}>
                  <Text style={{ fontSize: 11, color: colors.muted }}>{item.purpose}</Text>
                </View>
              </View>
              <View style={{ width: 52, height: 52, borderRadius: 26, borderWidth: 3, borderColor: getScoreColor(item.score), justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 16, fontWeight: "800", color: getScoreColor(item.score) }}>{item.score}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScreenContainer>
  );
}
