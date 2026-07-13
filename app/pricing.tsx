import { ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useSubscription } from "@/hooks/use-subscription";

const FREE_FEATURES = ["월 3회 분석", "기본 피드백", "말하기 습관 분석"];
const PRO_FEATURES = [
  "무제한 분석",
  "상세 AI 피드백",
  "말하기 습관 분석",
  "핵심 메시지 분석",
  "다음 미션 제공",
  "실시간 AI 코칭",
  "분석 기록 저장",
  "광고 제거",
  "우선 처리",
];

export default function PricingScreen() {
  const colors = useColors();
  const [isAnnual, setIsAnnual] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const { isPro, subscribe, restorePurchases } = useSubscription();

  const monthlyPrice = 19000;
  const annualPrice = 190000;
  const annualMonthly = Math.round(annualPrice / 12);

  const handleSubscribe = async () => {
    if (isPro) {
      Alert.alert("이미 Pro 플랜입니다", "현재 Pro 플랜을 이용 중입니다.");
      return;
    }
    setPurchasing(true);
    try {
      await subscribe(isAnnual ? "annual" : "monthly");
      Alert.alert("구독 완료!", "Pro 플랜으로 업그레이드되었습니다. 무제한으로 발표를 분석하세요!", [
        { text: "시작하기", onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert("결제 오류", "결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setPurchasing(true);
    try {
      await restorePurchases();
      Alert.alert("복원 완료", "구매 내역이 복원되었습니다.");
    } catch (e) {
      Alert.alert("복원 오류", "구매 복원 중 오류가 발생했습니다.");
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>플랜 선택</Text>
        {isPro && (
          <View style={{ marginLeft: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: `${colors.primary}20` }}>
            <Text style={{ fontSize: 11, color: colors.primary, fontWeight: "700" }}>Pro 이용 중</Text>
          </View>
        )}
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: colors.foreground, textAlign: "center", marginBottom: 8 }}>발표 실력을 키워보세요</Text>
        <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center", marginBottom: 24 }}>지금 Pro로 업그레이드하고 무제한으로 분석하세요</Text>

        {/* 월간/연간 토글 */}
        <View style={{ flexDirection: "row", backgroundColor: colors.surface, borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {[{ label: "월간", value: false }, { label: "연간 (17% 할인)", value: true }].map((opt) => (
            <TouchableOpacity
              key={String(opt.value)}
              onPress={() => setIsAnnual(opt.value)}
              style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: isAnnual === opt.value ? colors.primary : "transparent", alignItems: "center" }}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: isAnnual === opt.value ? colors.background : colors.muted }}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 무료 플랜 */}
        <View style={{ backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 20, marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground, marginBottom: 4 }}>무료 플랜</Text>
          <Text style={{ fontSize: 28, fontWeight: "800", color: colors.foreground, marginBottom: 16 }}>
            ₩0<Text style={{ fontSize: 14, fontWeight: "400", color: colors.muted }}>/월</Text>
          </Text>
          {FREE_FEATURES.map((f, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <IconSymbol name="checkmark" size={16} color={colors.muted} />
              <Text style={{ fontSize: 14, color: colors.muted }}>{f}</Text>
            </View>
          ))}
        </View>

        {/* Pro 플랜 */}
        <View style={{ backgroundColor: colors.surface, borderRadius: 16, borderWidth: 2, borderColor: colors.primary, padding: 20, marginBottom: 24 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>Pro 플랜</Text>
            <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: colors.primary }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.background }}>추천</Text>
            </View>
          </View>
          <Text style={{ fontSize: 28, fontWeight: "800", color: colors.primary, marginBottom: 4 }}>
            ₩{(isAnnual ? annualMonthly : monthlyPrice).toLocaleString()}
            <Text style={{ fontSize: 14, fontWeight: "400", color: colors.muted }}>/월</Text>
          </Text>
          {isAnnual && (
            <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 16 }}>
              연 ₩{annualPrice.toLocaleString()} 청구
            </Text>
          )}
          {!isAnnual && <View style={{ height: 16 }} />}
          {PRO_FEATURES.map((f, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <IconSymbol name="checkmark.circle.fill" size={16} color={colors.primary} />
              <Text style={{ fontSize: 14, color: colors.foreground }}>{f}</Text>
            </View>
          ))}
          <TouchableOpacity
            onPress={handleSubscribe}
            disabled={purchasing || isPro}
            style={{
              backgroundColor: isPro ? colors.surface2 : colors.primary,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
              marginTop: 16,
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
            activeOpacity={0.8}
          >
            {purchasing ? (
              <ActivityIndicator size="small" color={colors.background} />
            ) : (
              <Text style={{ fontSize: 15, fontWeight: "700", color: isPro ? colors.mutedDark : colors.background }}>
                {isPro ? "현재 플랜" : "Pro 시작하기"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 구매 복원 */}
        <TouchableOpacity onPress={handleRestore} style={{ alignItems: "center", marginBottom: 12 }} activeOpacity={0.7}>
          <Text style={{ fontSize: 13, color: colors.muted, textDecorationLine: "underline" }}>구매 복원</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 12, color: colors.mutedDark, textAlign: "center", lineHeight: 18 }}>
          언제든지 취소 가능 · 환불 정책 적용{"\n"}
          구독은 App Store / Google Play를 통해 관리됩니다
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}
