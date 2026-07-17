import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { transcribeAudio } from "./_core/voiceTranscription";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // 음성 업로드 후 URL 반환 (base64 → S3)
  voice: router({
    uploadAudio: publicProcedure
      .input(
        z.object({
          audioBase64: z.string(), // base64 encoded audio
          mimeType: z.string().default("audio/m4a"),
        }),
      )
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.audioBase64, "base64");
        const ext = input.mimeType.includes("webm") ? "webm" : input.mimeType.includes("wav") ? "wav" : "m4a";
        const { url } = await storagePut(`coaching/audio_${Date.now()}.${ext}`, buffer, input.mimeType);
        // url is relative like /manus-storage/..., make it absolute for transcription
        return { audioUrl: url };
      }),

    // 음성 전사
    transcribe: publicProcedure
      .input(
        z.object({
          audioUrl: z.string(),
          language: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const result = await transcribeAudio({
          audioUrl: input.audioUrl,
          language: input.language ?? "ko",
          prompt: "발표 연습 음성을 전사해주세요. 한국어입니다.",
        });

        if ("error" in result) {
          throw new Error(result.error);
        }

        return {
          text: result.text,
          duration: result.duration,
          language: result.language,
          segments: result.segments,
        };
      }),

    // AI 실시간 코칭 피드백 생성
    getCoachingFeedback: publicProcedure
      .input(
        z.object({
          transcribedText: z.string(),
          duration: z.number().optional(), // seconds
          sessionTexts: z.array(z.string()).optional(), // previous segments for context
        }),
      )
      .mutation(async ({ input }) => {
        const { transcribedText, duration, sessionTexts = [] } = input;

        const contextText =
          sessionTexts.length > 0
            ? `이전 발표 내용:\n${sessionTexts.join("\n")}\n\n최근 발표 내용:\n${transcribedText}`
            : transcribedText;

        const result = await invokeLLM({
          model: "claude-3-5-haiku",
          messages: [
            {
              role: "system",
              content: `당신은 전문 발표 코치입니다. 사용자의 발표 내용을 실시간으로 분석하고 간결한 피드백을 제공합니다.
피드백은 다음 JSON 형식으로 반환하세요:
{
  "fillerWords": [{"word": "음", "count": 3}],
  "speakingPace": "적절" | "빠름" | "느림",
  "tips": ["구체적인 개선 팁 1-2개"],
  "encouragement": "격려 메시지 (1문장)"
}`,
            },
            {
              role: "user",
              content: `발표 내용 (${duration ? Math.round(duration) + "초" : ""}): "${contextText}"`,
            },
          ],
          outputSchema: {
            name: "coaching_feedback",
            schema: {
              type: "object",
              properties: {
                fillerWords: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      word: { type: "string" },
                      count: { type: "number" },
                    },
                    required: ["word", "count"],
                  },
                },
                speakingPace: { type: "string", enum: ["적절", "빠름", "느림"] },
                tips: { type: "array", items: { type: "string" } },
                encouragement: { type: "string" },
              },
              required: ["fillerWords", "speakingPace", "tips", "encouragement"],
            },
          },
        });

        const content = result.choices[0]?.message?.content;
        if (!content || typeof content !== "string") {
          throw new Error("AI 응답을 받지 못했습니다");
        }

        try {
          return JSON.parse(content) as {
            fillerWords: { word: string; count: number }[];
            speakingPace: "적절" | "빠름" | "느림";
            tips: string[];
            encouragement: string;
          };
        } catch {
          return {
            fillerWords: [],
            speakingPace: "적절" as const,
            tips: ["발표를 계속 이어가세요"],
            encouragement: "잘 하고 있습니다!",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
