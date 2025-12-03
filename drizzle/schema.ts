import { integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: pgEnum("role", ["user", "admin"]).notNull().default("user"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabelas para o RevolteDs Drops
export const pessoas = pgTable("pessoas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: varchar("nome", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Pessoa = typeof pessoas.$inferSelect;
export type InsertPessoa = typeof pessoas.$inferInsert;

export const eventos = pgTable("eventos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: varchar("nome", { length: 255 }).notNull(),
  data: timestamp("data").notNull(),
  descricao: text("descricao"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Evento = typeof eventos.$inferSelect;
export type InsertEvento = typeof eventos.$inferInsert;

export const drops = pgTable("drops", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: varchar("nome", { length: 255 }).notNull(),
  tipo: varchar("tipo", { length: 100 }),
  eventoId: integer("eventoId").notNull(),
  status: varchar("status", { length: 50 }).default("Disponível").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Drop = typeof drops.$inferSelect;
export type InsertDrop = typeof drops.$inferInsert;

export const participacao = pgTable("participacao", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  eventoId: integer("eventoId").notNull(),
  pessoaId: integer("pessoaId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Participacao = typeof participacao.$inferSelect;
export type InsertParticipacao = typeof participacao.$inferInsert;

export const distribuicao = pgTable("distribuicao", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  eventoId: integer("eventoId").notNull(),
  pessoaId: integer("pessoaId").notNull(),
  dropId: integer("dropId").notNull(),
  dataDaEscolha: timestamp("dataDaEscolha").defaultNow().notNull(),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Distribuicao = typeof distribuicao.$inferSelect;
export type InsertDistribuicao = typeof distribuicao.$inferInsert;
