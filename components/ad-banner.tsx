/**
 * AdMob 배너 광고 컴포넌트
 * 
 * 사용법:
 * <AdBanner />
 * 
 * 무료 플랜 사용자에게만 광고를 표시합니다.
 * Pro 플랜 사용자에게는 광고가 표시되지 않습니다.
 */

import { View, Text, Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface AdBannerProps {
  isPro?: boolean;
}

export function AdBanner({ isPro = false }: AdBannerProps) {
  const colors = useColors();

  // Pro 사용자에게는 광고 미표시
  if (isPro) return null;

  // 웹에서는 광고 미표시
  if (Platform.OS === "web") return null;

  // 실제 앱에서는 react-native-google-mobile-ads의 BannerAd를 사용합니다.
  // 빌드 시 네이티브 모듈이 필요하므로 여기서는 플레이스홀더를 표시합니다.
  // 
  // 실제 구현:
  // import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";
  // import { AD_UNIT_IDS } from "@/lib/admob";
  // 
  // return (
  //   <BannerAd
  //     unitId={AD_UNIT_IDS.banner}
  //     size={BannerAdSize.BANNER}
  //     requestOptions={{ requestNonPersonalizedAdsOnly: true }}
  //   />
  // );

  return (
    <View
      style={{
        width: "100%",
        height: 50,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 11, color: colors.mutedDark }}>광고</Text>
    </View>
  );
}
