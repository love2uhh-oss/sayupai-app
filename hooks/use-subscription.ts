/**
 * 구독 상태 관리 훅
 * 
 * 실제 앱에서는 RevenueCat SDK를 사용하여 구독 상태를 확인합니다.
 * 현재는 로컬 상태로 관리합니다.
 */

import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type SubscriptionPlan = "free" | "pro";

interface SubscriptionState {
  plan: SubscriptionPlan;
  isPro: boolean;
  analysisCount: number;
  maxFreeAnalysis: number;
  loading: boolean;
  subscribe: (plan: "monthly" | "annual") => Promise<void>;
  restorePurchases: () => Promise<void>;
  incrementAnalysis: () => Promise<void>;
  canAnalyze: boolean;
}

const MAX_FREE_ANALYSIS = 3;
const STORAGE_KEY_PLAN = "subscription_plan";
const STORAGE_KEY_COUNT = "analysis_count_month";

export function useSubscription(): SubscriptionState {
  const [plan, setPlan] = useState<SubscriptionPlan>("free");
  const [analysisCount, setAnalysisCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptionState();
  }, []);

  const loadSubscriptionState = async () => {
    try {
      const [savedPlan, savedCount] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_PLAN),
        AsyncStorage.getItem(STORAGE_KEY_COUNT),
      ]);
      if (savedPlan === "pro") setPlan("pro");
      if (savedCount) setAnalysisCount(parseInt(savedCount, 10));
    } catch (e) {
      // 오류 무시
    } finally {
      setLoading(false);
    }
  };

  const subscribe = useCallback(async (subscriptionPlan: "monthly" | "annual") => {
    // 실제 앱에서는 RevenueCat SDK를 통해 결제 처리
    // import Purchases from "react-native-purchases";
    // import { PRODUCT_IDS } from "@/lib/purchases";
    // 
    // const offerings = await Purchases.getOfferings();
    // const pkg = offerings.current?.availablePackages.find(
    //   p => p.product.identifier === PRODUCT_IDS[subscriptionPlan]
    // );
    // if (pkg) await Purchases.purchasePackage(pkg);
    
    // 현재는 로컬 상태만 업데이트
    setPlan("pro");
    await AsyncStorage.setItem(STORAGE_KEY_PLAN, "pro");
  }, []);

  const restorePurchases = useCallback(async () => {
    // 실제 앱에서는 RevenueCat SDK를 통해 구매 복원
    // import Purchases from "react-native-purchases";
    // const customerInfo = await Purchases.restorePurchases();
    // const isPro = customerInfo.entitlements.active["pro"] !== undefined;
    // if (isPro) setPlan("pro");
    
    await loadSubscriptionState();
  }, []);

  const incrementAnalysis = useCallback(async () => {
    const newCount = analysisCount + 1;
    setAnalysisCount(newCount);
    await AsyncStorage.setItem(STORAGE_KEY_COUNT, String(newCount));
  }, [analysisCount]);

  const isPro = plan === "pro";
  const canAnalyze = isPro || analysisCount < MAX_FREE_ANALYSIS;

  return {
    plan,
    isPro,
    analysisCount,
    maxFreeAnalysis: MAX_FREE_ANALYSIS,
    loading,
    subscribe,
    restorePurchases,
    incrementAnalysis,
    canAnalyze,
  };
}
