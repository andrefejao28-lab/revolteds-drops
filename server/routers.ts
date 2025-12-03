import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getAllPessoas, getAllEventos, getAllDrops, getDropsByEventoId, getPessoasParticipantesByEventoId, getAllDistribuicoes, getDistribuicoesByEventoId, getDb } from "./db";
import { pessoas, eventos, drops, participacao, distribuicao } from "../drizzle/schema";
import { eq } from "drizzle-orm";

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

  // Pessoas router
  pessoas: router({
    list: publicProcedure.query(async () => {
      return getAllPessoas();
    }),
    create: protectedProcedure
      .input(z.object({ nome: z.string(), classe: z.string().optional(), observacoes: z.string().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.insert(pessoas).values(input);
        return result;
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(pessoas).where(eq(pessoas.id, input.id));
        return { success: true };
      }),
  }),

  // Eventos router
  eventos: router({
    list: publicProcedure.query(async () => {
      return getAllEventos();
    }),
    create: protectedProcedure
      .input(z.object({ nome: z.string(), data: z.date(), descricao: z.string().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.insert(eventos).values(input);
        return result;
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(eventos).where(eq(eventos.id, input.id));
        return { success: true };
      }),
  }),

  // Drops router
  drops: router({
    list: publicProcedure.query(async () => {
      return getAllDrops();
    }),
    byEvento: publicProcedure
      .input(z.object({ eventoId: z.number() }))
      .query(async ({ input }) => {
        return getDropsByEventoId(input.eventoId);
      }),
    create: protectedProcedure
      .input(z.object({ nome: z.string(), tipo: z.string().optional(), eventoId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.insert(drops).values(input);
        return result;
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(drops).where(eq(drops.id, input.id));
        return { success: true };
      }),
  }),

  // Participacao router
  participacao: router({
    byEvento: publicProcedure
      .input(z.object({ eventoId: z.number() }))
      .query(async ({ input }) => {
        return getPessoasParticipantesByEventoId(input.eventoId);
      }),
    create: protectedProcedure
      .input(z.object({ eventoId: z.number(), pessoaId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.insert(participacao).values(input);
        return result;
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(participacao).where(eq(participacao.id, input.id));
        return { success: true };
      }),
  }),

  // Distribuicao router
  distribuicao: router({
    list: publicProcedure.query(async () => {
      return getAllDistribuicoes();
    }),
    byEvento: publicProcedure
      .input(z.object({ eventoId: z.number() }))
      .query(async ({ input }) => {
        return getDistribuicoesByEventoId(input.eventoId);
      }),
    create: protectedProcedure
      .input(z.object({ eventoId: z.number(), pessoaId: z.number(), dropId: z.number(), observacoes: z.string().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        // Update drop status to "Escolhido"
        await db.update(drops).set({ status: "Escolhido" }).where(eq(drops.id, input.dropId));
        
        // Create distribution record
        const result = await db.insert(distribuicao).values(input);
        return result;
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(distribuicao).where(eq(distribuicao.id, input.id));
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
