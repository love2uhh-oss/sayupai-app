import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { getApiBaseUrl } from "@/constants/oauth";

type FeedbackItem = {
  id: string;
  time: string;
  tips: string[];
  encouragement: string;
  speakingPace: "적절" | "빠름" | "느림";
  fillerWords: { word: string; count: number }[];
};

export default function LiveCoachScreen() {
  const colors = useColors();
  const [isActive, setIsActive] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionTexts, setSessionTexts] = useState<string[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const segmentTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const uploadMutation = trpc.voice.uploadAudio.useMutation();
  const transcribeMutation = trpc.voice.transcribe.useMutation();
  const feedbackMutation = trpc.voice.getCoachingFeedback.useMutation();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const status = await requestRecordingPermissionsAsync();
        if (!status.granted) {
          Alert.alert(
            "마이크 권한 필요",
            "실시간 AI 코칭을 사용하려면 마이크 접근 권한이 필요합니다.",
          );
        }
        await setAudioModeAsync({ playsInSilentModeIOS: true, allowsRecording: true });
      }
    })();
  }, []);

  // 세그먼트 처리: 30초마다 녹음 중단 → 전사 → AI 피드백 → 재시작
  const processSegment = useCallback(async () => {
    if (!recorderState.isRecording) return;
    setIsProcessing(true);
    try {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      if (!uri) return;

      let audioBase64 = "";
      if (Platform.OS !== "web") {
        audioBase64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      // 업로드
      const apiBase = getApiBaseUrl();
      const { audioUrl } = await uploadMutation.mutateAsync({
        audioBase64,
        mimeType: "audio/m4a",
      });

      // 전사
      const transcription = await transcribeMutation.mutateAsync({
        audioUrl: `${apiBase}${audioUrl}`,
        language: "ko",
      });

      if (!transcription.text.trim()) {
        // 음성 없음 → 재시작
        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();
        setIsProcessing(false);
        return;
      }

      const newTexts = [...sessionTexts, transcription.text];
      setSessionTexts(newTexts);

      // AI 피드백
      const feedback = await feedbackMutation.mutateAsync({
        transcribedText: transcription.text,
        duration: transcription.duration,
        sessionTexts: sessionTexts,
      });

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

      setFeedbackList((prev) => [
        ...prev,
        {
          id: `${Date.now()}`,
          time: timeStr,
          tips: feedback.tips,
          encouragement: feedback.encouragement,
          speakingPace: feedback.speakingPace,
          fillerWords: feedback.fillerWords,
        },
      ]);

      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

      // 재시작
      if (isActive) {
        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();
      }
    } catch (e) {
      console.error("Segment processing error:", e);
      if (isActive) {
        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();
      }
    } finally {
      setIsProcessing(false);
    }
  }, [recorderState.isRecording, sessionTexts, isActive, audioRecorder]);

  const handleStart = useCallback(async () => {
    try {
      setIsActive(true);
      setFeedbackList([]);
      setSessionTexts([]);
      setElapsedSeconds(0);

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();

      // 경과 시간 타이머
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);

      // 30초마다 세그먼트 처리
      segmentTimerRef.current = setInterval(() => {
        processSegment();
      }, 30_000);
    } catch (e) {
      Alert.alert("오류", "녹음을 시작할 수 없습니다. 마이크 권한을 확인해주세요.");
      setIsActive(false);
    }
  }, [audioRecorder, processSegment]);

  const handleStop = useCallback(async () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (segmentTimerRef.current) clearInterval(segmentTimerRef.current);

    // 마지막 세그먼트 처리
    if (recorderState.isRecording) {
      await processSegment();
    }
  }, [recorderState.isRecording, processSegment]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (segmentTimerRef.current) clearInterval(segmentTimerRef.current);
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const paceColor =
    feedbackList.length > 0
      ? feedbackList[feedbackList.length - 1].speakingPace === "적절"
        ? colors.success
        : colors.warning
      : colors.muted;

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* 헤더 */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, flex: 1 }}>
          실시간 AI 코칭
        </Text>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 8,
            backgroundColor: isActive ? `${colors.success}20` : `${colors.muted}20`,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: isActive ? colors.success : colors.muted,
              fontWeight: "600",
            }}
          >
            {isActive ? "● LIVE" : "대기중"}
          </Text>
        </View>
      </View>

      {/* 상태 표시 영역 */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* 마이크 아이콘 */}
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: isActive ? `${colors.primary}20` : colors.surface,
            borderWidth: 2,
            borderColor: isActive ? colors.primary : colors.border,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconSymbol
            name={isActive ? "waveform" : "mic.fill"}
            size={28}
            color={isActive ? colors.primary : colors.muted}
          />
        </View>

        {/* 상태 텍스트 */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground }}>
            {isProcessing
              ? "AI 분석 중..."
              : isActive
                ? "발표를 이어가세요"
                : "코칭 시작 준비"}
          </Text>
          <Text style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>
            {isActive
              ? `경과 시간: ${formatTime(elapsedSeconds)} · 30초마다 피드백`
              : "시작 버튼을 누르면 AI가 실시간 피드백을 제공합니다"}
          </Text>
        </View>

        {/* 속도 표시 */}
        {isActive && feedbackList.length > 0 && (
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor: `${paceColor}20`,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: paceColor }}>
              {feedbackList[feedbackList.length - 1].speakingPace}
            </Text>
          </View>
        )}
      </View>

      {/* 피드백 목록 */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {feedbackList.length === 0 && (
          <View style={{ alignItems: "center", paddingTop: 40 }}>
            <IconSymbol name="mic.fill" size={48} color={colors.muted} />
            <Text
              style={{
                fontSize: 15,
                color: colors.muted,
                marginTop: 16,
                textAlign: "center",
                lineHeight: 22,
              }}
            >
              {isActive
                ? "발표를 시작하세요.\n30초마다 AI 피드백이 표시됩니다."
                : "코칭을 시작하면\nAI 피드백이 여기에 표시됩니다."}
            </Text>
          </View>
        )}

        {feedbackList.map((item) => (
          <View
            key={item.id}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 12, color: colors.muted }}>{item.time}</Text>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                  backgroundColor:
                    item.speakingPace === "적절"
                      ? `${colors.success}20`
                      : `${colors.warning}20`,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: item.speakingPace === "적절" ? colors.success : colors.warning,
                    fontWeight: "600",
                  }}
                >
                  속도 {item.speakingPace}
                </Text>
              </View>
            </View>

            {/* 격려 메시지 */}
            <Text
              style={{
                fontSize: 14,
                color: colors.primary,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              {item.encouragement}
            </Text>

            {/* 팁 */}
            {item.tips.map((tip, i) => (
              <View
                key={i}
                style={{ flexDirection: "row", gap: 6, alignItems: "flex-start", marginBottom: 4 }}
              >
                <Text style={{ fontSize: 13, color: colors.primary }}>•</Text>
                <Text style={{ fontSize: 13, color: colors.foreground, flex: 1, lineHeight: 20 }}>
                  {tip}
                </Text>
              </View>
            ))}

            {/* 필러워드 */}
            {item.fillerWords.length > 0 && (
              <View
                style={{
                  marginTop: 8,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                {item.fillerWords.map((fw, i) => (
                  <View
                    key={i}
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 8,
                      backgroundColor: `${colors.error}15`,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: colors.error }}>
                      {fw.word} {fw.count}회
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* 하단 버튼 */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: 32,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={isActive ? handleStop : handleStart}
          style={{
            backgroundColor: isActive ? colors.error : colors.primary,
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: "center",
          }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.background }}>
            {isProcessing ? "분석 중..." : isActive ? "코칭 종료" : "코칭 시작"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
