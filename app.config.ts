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
  appName: "SayUp AI",
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
  version: "1.2.7",
  runtimeVersion: "1.2.7",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: env.iosBundleId,
    buildNumber: "47",
    "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
  },
  android: {
    versionCode: 47,
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
        microphonePermission: "SayUp AI uses the microphone to record your voice during presentation practice sessions. For example, when you tap the record button to practice a speech, your voice is captured and analyzed by AI to provide feedback on your speaking pace, clarity, and delivery. Recordings are processed for coaching purposes only.",
      },
    ],
    [
      "expo-image-picker",
      {
        cameraPermission: "SayUp AI uses the camera to record your presentation video so the AI can analyze your body language, facial expressions, and delivery style. For example, you can record yourself giving a speech and receive detailed coaching feedback. Video is used for analysis only.",
        microphonePermission: "SayUp AI uses the microphone to record audio during video capture for presentation analysis. Your voice is analyzed alongside your video to provide comprehensive coaching feedback on both delivery and content.",
        photosPermission: "SayUp AI accesses your photo library to let you select an existing presentation video for AI analysis. For example, you can choose a previously recorded speech to receive coaching feedback on your delivery and speaking style.",
      },
    ],
    [
      "expo-video",
      {
        supportsBackgroundPlayback: false,
        supportsPictureInPicture: false,
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
          extraMavenRepos: [],
          kotlinVersion: "2.1.0",
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId: "6817d949-85f1-4e99-98b6-7606eea926e5",
    },
  },
  owner: "kimhyohyeong",
};

export default config;
