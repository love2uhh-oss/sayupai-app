import { ScrollView, Text, View, TouchableOpacity, Alert, Platform } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { AdBanner } from "@/components/ad-banner";
import { useSubscription } from "@/hooks/use-subscription";
import * as ImagePicker from "expo-image-picker";

const PURPOSES = [
  { id: "ir", label: "IR 피치", emoji: "💼" },
  { id: "team", label: "팀 보고", emoji: "👥" },
  { id: "class", label: "수업 발표", emoji: "📚" },
  { id: "interview", label: "면접", emoji: "🎯" },
  { id: "seminar", label: "세미나", emoji: "🎤" },
  { id: "other", label: "기타", emoji: "✨" },
];

export default function StartScreen() {
  const colors = useColors();
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const { isPro, canAnalyze, incrementAnalysis } = useSubscription();

  const pickFromGallery = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "권한 필요",
          "발표 영상을 선택하려면 사진 라이브러리 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요."
        );
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setVideoUri(result.assets[0].uri);
      setHasVideo(true);
    }
  };

  const pickFromCamera = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "권한 필요",
          "발표 영상을 촬영하려면 카메라 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요."
        );
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setVideoUri(result.assets[0].uri);
      setHasVideo(true);
    }
  };

  const handlePickVideo = () => {
    Alert.alert("영상 선택", "발표 영상을 어떻게 추가하시겠어요?", [
      { text: "카메라로 촬영", onPress: pickFromCamera },
      { text: "갤러리에서 선택", onPress: pickFromGallery },
      { text: "취소", style: "cancel" },
    ]);
  };

  const handleStart = async () => {
    if (!hasVideo) { Alert.alert("영상 필요", "분석할 발표 영상을 먼저 선택해주세요."); return; }
    if (!selectedPurpose) { Alert.alert("목적 선택", "발표 목적을 선택해주세요."); return; }
    if (!canAnalyze) {
      Alert.alert(
        "무료 플랜 한도 초과",
        "이번 달 무료 분석 횟수를 모두 사용했습니다. Pro 플랜으로 업그레이드하면 무제한으로 분석할 수 있습니다.",
        [
          { text: "취소", style: "cancel" },
          { text: "Pro 업그레이드", onPress: () => router.push("/pricing") },
        ]
      );
      return;
    }
    await incrementAnalysis();
    router.push("/analysis");
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>발표 분석 시작</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground, marginBottom: 12 }}>발표 영상 선택</Text>
        <TouchableOpacity
          onPress={handlePickVideo}
          style={{ backgroundColor: colors.surface, borderRadius: 16, borderWidth: 2, borderColor: hasVideo ? colors.primary : colors.border, borderStyle: hasVideo ? "solid" : "dashed", padding: 32, alignItems: "center", marginBottom: 28 }}
          activeOpacity={0.8}
        >
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: hasVideo ? `${colors.primary}20` : colors.surface2, justifyContent: "center", alignItems: "center", marginBottom: 12 }}>
            <IconSymbol name={hasVideo ? "checkmark.circle.fill" : "video.fill"} size={28} color={hasVideo ? colors.primary : colors.muted} />
          </View>
          <Text style={{ fontSize: 15, fontWeight: "600", color: hasVideo ? colors.primary : colors.foreground }}>
            {hasVideo ? "영상이 선택되었습니다" : "영상 업로드"}
          </Text>
          <Text style={{ fontSize: 13, color: colors.muted, marginTop: 4, textAlign: "center" }}>
            {hasVideo ? "탭하여 다시 선택" : "발표 영상을 선택하거나\n카메라로 촬영하세요"}
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground, marginBottom: 12 }}>발표 목적</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
          {PURPOSES.map((purpose) => (
            <TouchableOpacity
              key={purpose.id}
              onPress={() => setSelectedPurpose(purpose.id)}
              style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: selectedPurpose === purpose.id ? colors.primary : colors.border, backgroundColor: selectedPurpose === purpose.id ? `${colors.primary}15` : colors.surface, flexDirection: "row", alignItems: "center", gap: 6 }}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 14 }}>{purpose.emoji}</Text>
              <Text style={{ fontSize: 14, fontWeight: selectedPurpose === purpose.id ? "600" : "400", color: selectedPurpose === purpose.id ? colors.primary : colors.foreground }}>{purpose.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          onPress={handleStart}
          style={{ backgroundColor: hasVideo && selectedPurpose ? colors.primary : colors.surface2, borderRadius: 12, paddingVertical: 16, alignItems: "center" }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: hasVideo && selectedPurpose ? colors.background : colors.mutedDark }}>AI 분석 시작</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 12, color: colors.mutedDark, textAlign: "center", marginTop: 12 }}>분석에는 약 2~5분이 소요됩니다</Text>
      </ScrollView>
      <AdBanner isPro={isPro} />
    </ScreenContainer>
  );
}
