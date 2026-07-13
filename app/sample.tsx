import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

const SAMPLE_DATA = {
  title: "팀 프로젝트 발표",
  date: "2024.01.15",
  duration: "5분 32초",
  score: 78,
  fillerWords: [
    { word: "음...", count: 12 },
    { word: "그...", count: 8 },
    { word: "어...", count: 6 },
  ],
  speakingRate: "분당 145단어",
  clarity: "보통",
  keyMessage: "프로젝트의 핵심 가치와 차별점을 명확히 전달했으나, 결론 부분에서 설득력이 다소 부족했습니다.",
  nextMission: "필러워드를 줄이고 침묵을 활용하는 연습을 해보세요.",
  improvements: [
    "필러워드(음, 그, 어) 사용을 줄여보세요",
    "말하는 속도를 조금 늦춰 청중이 이해할 시간을 주세요",
    "결론에서 핵심 메시지를 한 번 더 강조해보세요",
  ],
};

export default function SampleScreen() {
  const colors = useColors();
  const scoreColor =
    SAMPLE_DATA.score >= 80 ? colors.success : SAMPLE_DATA.score >= 60 ? colors.warning : colors.error;

  return (
    <ScreenContainer containerClassName="bg-background">
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>
          샘플 분석 리포트
        </Text>
        <View
          style={{
            marginLeft: 10,
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 8,
            backgroundColor: `${colors.primary}20`,
          }}
        >
          <Text style={{ fontSize: 11, color: colors.primary, fontWeight: "600" }}>SAMPLE</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground, marginBottom: 4 }}>
            {SAMPLE_DATA.title}
          </Text>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <Text style={{ fontSize: 13, color: colors.muted }}>{SAMPLE_DATA.date}</Text>
            <Text style={{ fontSize: 13, color: colors.muted }}>{SAMPLE_DATA.duration}</Text>
          </View>
        </View>
        <View
          style={{
            marginHorizontal: 20, marginTop: 20, backgroundColor: colors.surface,
            borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 24, alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 12 }}>종합 발표 점수</Text>
          <View
            style={{
              width: 100, height: 100, borderRadius: 50, borderWidth: 4,
              borderColor: scoreColor, justifyContent: "center", alignItems: "center", marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 36, fontWeight: "800", color: scoreColor }}>{SAMPLE_DATA.score}</Text>
          </View>
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
            {SAMPLE_DATA.score >= 80 ? "우수" : SAMPLE_DATA.score >= 60 ? "보통" : "개선 필요"}
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: 20, marginTop: 16, backgroundColor: colors.surface,
            borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 20,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground, marginBottom: 16 }}>
            말하기 습관 분석
          </Text>
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
            <View style={{ flex: 1, backgroundColor: colors.surface2, borderRadius: 10, padding: 14 }}>
              <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>말하기 속도</Text>
              <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>{SAMPLE_DATA.speakingRate}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.surface2, borderRadius: 10, padding: 14 }}>
              <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>발음 명확도</Text>
              <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>{SAMPLE_DATA.clarity}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 10 }}>필러워드 사용</Text>
          {SAMPLE_DATA.fillerWords.map((fw, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                paddingVertical: 8, borderBottomWidth: i < SAMPLE_DATA.fillerWords.length - 1 ? 1 : 0, borderBottomColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 14, color: colors.foreground }}>{fw.word}</Text>
              <View style={{ paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, backgroundColor: `${colors.error}20` }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: colors.error }}>{fw.count}회</Text>
              </View>
            </View>
          ))}
        </View>
        <View
          style={{
            marginHorizontal: 20, marginTop: 16, backgroundColor: `${colors.primary}15`,
            borderRadius: 16, borderWidth: 1, borderColor: `${colors.primary}40`, padding: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <IconSymbol name="target" size={18} color={colors.primary} />
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.primary }}>다음 미션</Text>
          </View>
          <Text style={{ fontSize: 14, color: colors.foreground, lineHeight: 22 }}>{SAMPLE_DATA.nextMission}</Text>
        </View>
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <TouchableOpacity
            onPress={() => router.push("/start")}
            style={{ backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: "center", marginBottom: 12 }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.background }}>내 발표 분석하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
