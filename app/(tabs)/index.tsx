import { ScrollView, Text, View, TouchableOpacity, StatusBar } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { AdBanner } from "@/components/ad-banner";
import { useSubscription } from "@/hooks/use-subscription";

export default function HomeScreen() {
  const colors = useColors();
  const { isPro, analysisCount, maxFreeAnalysis, canAnalyze } = useSubscription();

  return (
    <ScreenContainer containerClassName="bg-background">
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconSymbol name="mic.fill" size={18} color={colors.background} />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.foreground,
                letterSpacing: -0.5,
              }}
            >
              SayUp<Text style={{ color: colors.primary }}>AI</Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/sample")}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ fontSize: 13, color: colors.muted }}>샘플 보기</Text>
          </TouchableOpacity>
        </View>

        {/* 히어로 섹션 */}
        <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 }}>
          {/* AI 발표 코치 배지 */}
          <View
            style={{
              alignSelf: "flex-start",
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.primary,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 12, color: colors.primary, fontWeight: "600" }}>
              ✦ AI 발표 코치
            </Text>
          </View>

          {/* 메인 타이틀 */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: colors.foreground,
              lineHeight: 38,
              marginBottom: 16,
              letterSpacing: -0.5,
            }}
          >
            발표가 두렵다면{"\n"}
            <Text style={{ color: colors.primary }}>AI</Text>에게 맡기세요
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: colors.muted,
              lineHeight: 24,
              marginBottom: 32,
            }}
          >
            발표 영상을 업로드하면 AI가 말하기 습관, 핵심 메시지, 개선점을 분석해 드립니다.
          </Text>

          {/* 통계 카드 */}
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginBottom: 32,
            }}
          >
            {[
              { value: "97%", label: "분석 정확도" },
              { value: "3분", label: "평균 분석 시간" },
              { value: "0원", label: "무료 시작" },
            ].map((stat, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 14,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "800",
                    color: colors.primary,
                    marginBottom: 4,
                  }}
                >
                  {stat.value}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.muted,
                    textAlign: "center",
                  }}
                >
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>

          {/* CTA 버튼들 */}
          <TouchableOpacity
            onPress={() => router.push("/start")}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              marginBottom: 12,
            }}
            activeOpacity={0.8}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.background,
              }}
            >
              발표 분석 시작하기
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/live-coach")}
            style={{
              backgroundColor: "transparent",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              marginBottom: 12,
              borderWidth: 1,
              borderColor: colors.primary,
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
            activeOpacity={0.8}
          >
            <IconSymbol name="wifi" size={18} color={colors.primary} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.primary,
              }}
            >
              실시간 AI 코칭
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/sample")}
            style={{
              backgroundColor: "transparent",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border,
            }}
            activeOpacity={0.8}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.muted,
              }}
            >
              게스트로 샘플 체험
            </Text>
          </TouchableOpacity>
        </View>

        {/* 기능 소개 섹션 */}
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.foreground,
              marginBottom: 16,
            }}
          >
            AI가 분석하는 항목
          </Text>
          {[
            { icon: "waveform" as const, title: "말하기 습관", desc: "필러워드, 말 속도, 발음 명확도" },
            { icon: "lightbulb.fill" as const, title: "핵심 메시지", desc: "전달력, 논리 구조, 설득력" },
            { icon: "target" as const, title: "다음 미션", desc: "개인화된 개선 과제 제시" },
          ].map((item, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 14,
                marginBottom: i < 2 ? 16 : 0,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: `${colors.primary}20`,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconSymbol name={item.icon} size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.foreground,
                    marginBottom: 2,
                  }}
                >
                  {item.title}
                </Text>
                <Text style={{ fontSize: 13, color: colors.muted }}>
                  {item.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* 안내 텍스트 */}
        {!isPro && (
          <View style={{ marginHorizontal: 20, marginBottom: 8, backgroundColor: colors.surface, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center" }}>
              이번 달 분석 횟수: <Text style={{ fontWeight: "700", color: analysisCount >= maxFreeAnalysis ? colors.error : colors.primary }}>{analysisCount}/{maxFreeAnalysis}회</Text>
              {analysisCount >= maxFreeAnalysis ? " (한도 초과 - Pro로 업그레이드)" : " 남음"}
            </Text>
          </View>
        )}
        <Text
          style={{
            fontSize: 12,
            color: colors.mutedDark,
            textAlign: "center",
            paddingHorizontal: 20,
            lineHeight: 18,
          }}
        >
          무료 플랜으로 매월 3회 분석 가능 · Pro 플랜으로 무제한 이용
        </Text>
      </ScrollView>
      <AdBanner isPro={isPro} />
    </ScreenContainer>
  );
}
