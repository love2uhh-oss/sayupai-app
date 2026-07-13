// Load environment variables with proper priority (system > .env)
import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

// Bundle ID format: space.manus.<project_name_dots>.<timestamp>
// e.g., "my-app" created at 2024-01-15 10:30:45 -> "space.manus.my.app.t20240115103045"
// Bundle ID can only contain letters, numbers, and dots
// Android requires each dot-separated segment to start with a letter
// 기존 App Store / Play Store에 출시된 앱과 동일한 번들 ID 사용
const bundleId = "com.speakfitai.app";
const schemeFromBundleId = "sayupai";

const env = {
  // App branding - update these values directly (do not use env vars)
  appName: "SayUpAI - AI 발표 코치",
  appSlug: "sayupai-app",
  // S3 URL of the app logo - set this to the URL returned by generate_image when creating custom logo
  // Leave empty to use the default icon from assets/images/icon.png
  logoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663723575982/WUg6ZGcFekq5soumqZThaR/icon-9MYr6cUwQAPpDRmhMe4Q4E.png",
  scheme: schemeFromBundleId,
  iosBundleId: bundleId,
  androidPackage: bundleId,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: "2.0.0",
  runtimeVersion: "2.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: env.iosBundleId,
    buildNumber: "35",
    "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
  },
  android: {
    versionCode: 35,
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: env.androidPackage,
    permissions: ["POST_NOTIFICATIONS"],
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: env.scheme,
            host: "*",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-audio",
      {
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone.",
      },
    ],
    [
      "expo-video",
      {
        supportsBackgroundPlayback: true,
        supportsPictureInPicture: true,
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          buildArchs: ["armeabi-v7a", "arm64-v8a"],
          minSdkVersion: 24,
        },
      },
    ],
    [
      "react-native-google-mobile-ads",
      {
        // 실제 배포 시 아래 ID를 실제 AdMob App ID로 교체하세요
        // Google AdMob 콘솔에서 앱 ID를 확인하세요
        androidAppId: "ca-app-pub-3940256099942544~3347511713",  // 테스트 ID
        iosAppId: "ca-app-pub-3940256099942544~1458002511",      // 테스트 ID
        // 실제 ID 예시:
        // androidAppId: "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
        // iosAppId: "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
        userTrackingUsageDescription: "This identifier will be used to deliver personalized ads to you.",
        skAdNetworkItems: [
          { skAdNetworkIdentifier: "cstr6suwn9.skadnetwork" },
          { skAdNetworkIdentifier: "4fzdc2evr5.skadnetwork" },
          { skAdNetworkIdentifier: "2fnua5tdw4.skadnetwork" },
          { skAdNetworkIdentifier: "ydx93a7ass.skadnetwork" },
        ],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
