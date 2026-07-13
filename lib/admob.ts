/**
 * AdMob 광고 유틸리티
 * 실제 SayUpAI 앱의 AdMob 광고 단위 ID
 * Publisher ID: ca-app-pub-2375579033560413
 */

import { Platform } from "react-native";

export const AD_UNIT_IDS = {
  // 배너 광고
  banner: Platform.select({
    ios: "ca-app-pub-2375579033560413/8450667821",
    android: "ca-app-pub-2375579033560413/8450667821",
    default: "ca-app-pub-2375579033560413/8450667821",
  })!,
  // 전면 광고
  interstitial: Platform.select({
    ios: "ca-app-pub-2375579033560413/2566270381",
    android: "ca-app-pub-2375579033560413/2566270381",
    default: "ca-app-pub-2375579033560413/2566270381",
  })!,
  // 보상형 광고 (iOS/Android 별도 단위 생성 필요 시 교체)
  rewarded: Platform.select({
    ios: "ca-app-pub-2375579033560413/2566270381",
    android: "ca-app-pub-2375579033560413/2566270381",
    default: "ca-app-pub-2375579033560413/2566270381",
  })!,
};
