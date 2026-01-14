import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          phone: z.string().min(1),
          email: z.string().email(),
          type: z.enum(["consumer", "business"]),
          companyName: z.string().optional(),
          cnpj: z.string().optional(),
          contactPreference: z.enum(["whatsapp", "email", "phone"]),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const contactType = input.type === "consumer" ? "Consumidor" : "Empresa";
        const preferenceLabel = input.contactPreference === "whatsapp" ? "WhatsApp" : input.contactPreference === "email" ? "Email" : "Telefone";
        
        let emailContent = `
Novo Contato via Formulário Kadeh

Nome: ${input.name}
Telefone: ${input.phone}
Email: ${input.email}
Tipo: ${contactType}
Preferência de Contato: ${preferenceLabel}
`;

        if (input.type === "business") {
          emailContent += `
Empresa: ${input.companyName || "N/A"}
CNPJ: ${input.cnpj || "N/A"}
`;
        }

        if (input.message) {
          emailContent += `
Mensagem:
${input.message}
`;
        }

        await notifyOwner({
          title: `Novo Contato: ${input.name}`,
          content: emailContent,
        });

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
