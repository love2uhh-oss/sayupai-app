import { Text, View, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useSubscription } from "@/hooks/use-subscription";

// 실제 앱에서는 아래 주석 해제:
// import { InterstitialAd, AdEventType, TestIds } from "react-native-google-mobile-ads";
// import { AD_UNIT_IDS } from "@/lib/admob";
// const interstitial = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial);

const STEPS = [
  "영상 업로드 중...",
  "음성 추출 중...",
  "AI 분석 중...",
  "리포트 생성 중...",
];

export default function AnalysisScreen() {
  const colors = useColors();
  const { isPro } = useSubscription();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [showingAd, setShowingAd] = useState(false);

  // 분석 완료 후 무료 사용자에게 인터스티셜 광고 표시
  const handleViewReport = async () => {
    if (!isPro && Platform.OS !== "web") {
      // 실제 앱에서는:
      // setShowingAd(true);
      // interstitial.load();
      // interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      //   setShowingAd(false);
      //   router.replace("/sample");
      // });
      // interstitial.addAdEventListener(AdEventType.LOADED, () => interstitial.show());
    }
    router.replace("/sample");
  };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i), i * 1500));
    });
    timers.push(setTimeout(() => setDone(true), STEPS.length * 1500 + 500));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        {!done ? (
          <>
            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: `${colors.primary}15`, borderWidth: 3, borderColor: colors.primary, justifyContent: "center", alignItems: "center", marginBottom: 32 }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
            <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground, marginBottom: 12 }}>분석 중...</Text>
            <Text style={{ fontSize: 15, color: colors.primary, marginBottom: 32 }}>{STEPS[step]}</Text>
            <View style={{ width: "100%", gap: 12 }}>
              {STEPS.map((s, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: i <= step ? `${colors.primary}20` : colors.surface, borderWidth: 1, borderColor: i <= step ? colors.primary : colors.border, justifyContent: "center", alignItems: "center" }}>
                    {i < step ? <IconSymbol name="checkmark" size={12} color={colors.primary} /> : i === step ? <ActivityIndicator size="small" color={colors.primary} /> : null}
                  </View>
                  <Text style={{ fontSize: 14, color: i <= step ? colors.foreground : colors.mutedDark }}>{s}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: `${colors.success}15`, borderWidth: 3, borderColor: colors.success, justifyContent: "center", alignItems: "center", marginBottom: 24 }}>
              <IconSymbol name="checkmark.circle.fill" size={48} color={colors.success} />
            </View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: colors.foreground, marginBottom: 8 }}>분석 완료!</Text>
            <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center", marginBottom: 32 }}>AI 분석 리포트가 준비되었습니다</Text>
            <TouchableOpacity
              onPress={handleViewReport}
              style={{ backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 40 }}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 16, fontWeight: "700", color: colors.background }}>리포트 보기</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScreenContainer>
  );
}
