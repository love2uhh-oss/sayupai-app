import { Text, View, TouchableOpacity, Share, Alert } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

const MY_CODE = "SAYUP2024";

export default function InviteScreen() {
  const colors = useColors();

  const handleShare = async () => {
    try {
      await Share.share({ message: `SayUpAI 초대 코드: ${MY_CODE}
https://sayupai.co.kr` });
    } catch {}
  };

  const handleCopy = () => {
    Alert.alert("복사됨", "초대 코드가 클립보드에 복사되었습니다.");
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>친구 초대</Text>
      </View>
      <View style={{ flex: 1, padding: 24 }}>
        <View style={{ backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 24, alignItems: "center", marginBottom: 24 }}>
          <IconSymbol name="gift.fill" size={40} color={colors.primary} />
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginTop: 16, marginBottom: 8 }}>친구 초대하고 혜택 받기</Text>
          <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center", lineHeight: 22 }}>{"친구가 초대 코드로 가입하면\n양쪽 모두 추가 분석 1회를 받습니다"}</Text>
        </View>
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.muted, marginBottom: 8 }}>내 초대 코드</Text>
        <View style={{ backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: "800", color: colors.primary, letterSpacing: 2 }}>{MY_CODE}</Text>
          <TouchableOpacity onPress={handleCopy} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: `${colors.primary}20` }} activeOpacity={0.8}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.primary }}>복사</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleShare}
          style={{ backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 }}
          activeOpacity={0.8}
        >
          <IconSymbol name="square.and.arrow.up" size={18} color={colors.background} />
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.background }}>초대 링크 공유하기</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
