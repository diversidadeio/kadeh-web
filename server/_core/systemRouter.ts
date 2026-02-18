import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";
import { generateImage } from "./imageGeneration";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  generateStoreVisualization: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1, "prompt is required"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await generateImage({
          prompt: input.prompt,
        });
        return {
          success: true,
          url: result.url,
        };
      } catch (error) {
        console.error("Error generating store visualization:", error);
        throw new Error("Failed to generate store visualization");
      }
    }),
});
