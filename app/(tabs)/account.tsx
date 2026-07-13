import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";

export default function AccountScreen() {
  const colors = useColors();
  const { user, isAuthenticated, logout } = useAuth();

  const { isPro, analysisCount, maxFreeAnalysis } = useSubscription();

  const handleUpgrade = () => {
    router.push("/pricing");
  };

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "로그아웃", style: "destructive", onPress: logout },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: colors.surface,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <IconSymbol name="person.fill" size={36} color={colors.muted} />
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: colors.foreground,
              marginBottom: 8,
            }}
          >
            로그인이 필요합니다
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.muted,
              textAlign: "center",
              marginBottom: 32,
              lineHeight: 22,
            }}
          >
            로그인하면 분석 기록을 저장하고{"\n"}Pro 플랜을 이용할 수 있습니다.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/auth")}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingVertical: 14,
              paddingHorizontal: 40,
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
              로그인 / 회원가입
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const initials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: colors.foreground,
            }}
          >
            내 계정
          </Text>
        </View>

        {/* 프로필 카드 */}
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: `${colors.primary}30`,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: colors.primary,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: colors.primary,
                }}
              >
                {initials}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    color: colors.foreground,
                  }}
                >
                  {user?.name ?? user?.email ?? "사용자"}
                </Text>
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 10,
                    backgroundColor: isPro ? colors.primary : colors.surface2,
                    borderWidth: 1,
                    borderColor: isPro ? colors.primary : colors.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: isPro ? colors.background : colors.muted,
                    }}
                  >
                    {isPro ? "PRO" : "FREE"}
                  </Text>
                </View>
              </View>
              <Text style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>
                {user?.email ?? ""}
              </Text>
            </View>
          </View>
        </View>

        {/* 현재 플랜 */}
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.muted,
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            현재 플랜
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>
                {isPro ? "Pro 플랜" : "무료 플랜"}
              </Text>
              <Text style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>
                {isPro ? "무제한 분석" : "월 3회 분석 가능"}
              </Text>
            </View>
            {!isPro && (
              <TouchableOpacity
                onPress={handleUpgrade}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
                activeOpacity={0.8}
              >
                <IconSymbol name="crown.fill" size={14} color={colors.background} />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: colors.background,
                  }}
                >
                  업그레이드
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {!isPro && (
            <TouchableOpacity
              onPress={() => router.push("/pricing")}
              style={{
                marginTop: 14,
                paddingVertical: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
              }}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 13, color: colors.muted }}>
                플랜 비교 보기
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 초대 코드 섹션 */}
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.muted,
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            친구 초대
          </Text>
          <Text style={{ fontSize: 14, color: colors.foreground, marginBottom: 12 }}>
            친구를 초대하면 추가 분석 횟수를 받을 수 있습니다.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/invite")}
            style={{
              paddingVertical: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.primary,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
            activeOpacity={0.8}
          >
            <IconSymbol name="gift.fill" size={16} color={colors.primary} />
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
              초대 코드 확인하기
            </Text>
          </TouchableOpacity>
        </View>

        {/* 계정 관리 */}
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.muted,
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            계정 관리
          </Text>
          {[
            { label: "분석 기록 관리", icon: "clock.fill" as const, onPress: () => router.push("/history") },
            { label: "로그아웃", icon: "xmark" as const, onPress: handleLogout },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={item.onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingVertical: 14,
                borderTopWidth: i === 0 ? 1 : 0,
                borderTopColor: colors.border,
              }}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <IconSymbol name={item.icon} size={18} color={colors.muted} />
                <Text style={{ fontSize: 15, color: colors.foreground }}>{item.label}</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.mutedDark} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
