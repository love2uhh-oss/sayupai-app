/**
 * RevenueCat 인앱결제 유틸리티
 * 
 * 실제 앱 배포 시 아래 API 키를 실제 RevenueCat API 키로 교체하세요:
 * - iOS API Key: appl_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 * - Android API Key: goog_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 * 
 * RevenueCat 대시보드에서 제품 ID를 설정하세요.
 */

import { Platform } from "react-native";

// RevenueCat API 키
export const REVENUECAT_API_KEY = Platform.select({
  ios: "appl_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",      // iOS RevenueCat API Key
  android: "goog_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",  // Android RevenueCat API Key
  default: "",
})!;

// 제품 ID (RevenueCat 대시보드에서 설정한 ID와 일치해야 함)
export const PRODUCT_IDS = {
  // 월간 구독
  monthly: Platform.select({
    ios: "sayupai_pro_monthly",
    android: "sayupai_pro_monthly",
    default: "sayupai_pro_monthly",
  })!,
  // 연간 구독
  annual: Platform.select({
    ios: "sayupai_pro_annual",
    android: "sayupai_pro_annual",
    default: "sayupai_pro_annual",
  })!,
};

// 구독 엔타이틀먼트 ID
export const ENTITLEMENT_ID = "pro";

// 가격 정보 (실제 앱에서는 RevenueCat에서 동적으로 가져옴)
export const PLAN_PRICES = {
  monthly: {
    price: 19000,
    currency: "KRW",
    label: "₩19,000/월",
  },
  annual: {
    price: 190000,
    currency: "KRW",
    label: "₩190,000/년",
    monthlyEquivalent: Math.round(190000 / 12),
  },
};
