/**
 * AdMob 광고 유틸리티
 * 
 * 실제 앱 배포 시 아래 ID를 실제 AdMob ID로 교체하세요:
 * - iOS App ID: ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
 * - Android App ID: ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
 * 
 * 테스트 중에는 테스트 광고 ID를 사용합니다.
 */

import { Platform } from "react-native";

// 테스트 광고 ID (개발/테스트 전용)
export const AD_UNIT_IDS = {
  // 배너 광고
  banner: Platform.select({
    ios: "ca-app-pub-3940256099942544/2934735716",      // iOS 테스트 배너
    android: "ca-app-pub-3940256099942544/6300978111",  // Android 테스트 배너
    default: "ca-app-pub-3940256099942544/6300978111",
  })!,
  // 전면 광고
  interstitial: Platform.select({
    ios: "ca-app-pub-3940256099942544/4411468910",      // iOS 테스트 전면
    android: "ca-app-pub-3940256099942544/1033173712",  // Android 테스트 전면
    default: "ca-app-pub-3940256099942544/1033173712",
  })!,
  // 보상형 광고
  rewarded: Platform.select({
    ios: "ca-app-pub-3940256099942544/1712485313",      // iOS 테스트 보상형
    android: "ca-app-pub-3940256099942544/5224354917",  // Android 테스트 보상형
    default: "ca-app-pub-3940256099942544/5224354917",
  })!,
};

// 프로덕션 광고 ID (실제 배포 시 사용)
// export const AD_UNIT_IDS = {
//   banner: Platform.select({
//     ios: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
//     android: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
//     default: "",
//   })!,
//   interstitial: Platform.select({
//     ios: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
//     android: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
//     default: "",
//   })!,
//   rewarded: Platform.select({
//     ios: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
//     android: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
//     default: "",
//   })!,
// };
