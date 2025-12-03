import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createAuthContext(): TrpcContext {
  const user = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("RevolteDs Drops - tRPC Procedures", () => {
  const ctx = createAuthContext();
  const caller = appRouter.createCaller(ctx);

  it("should list pessoas", async () => {
    const result = await caller.pessoas.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should list eventos", async () => {
    const result = await caller.eventos.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should list drops", async () => {
    const result = await caller.drops.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should list distribuicoes", async () => {
    const result = await caller.distribuicao.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should create a pessoa", async () => {
    const result = await caller.pessoas.create({
      nome: "Test Pessoa",
      classe: "Warrior",
      observacoes: "Test",
    });
    expect(result).toBeDefined();
  });

  it("should create an evento", async () => {
    const result = await caller.eventos.create({
      nome: "Test Evento",
      data: new Date(),
      descricao: "Test evento",
    });
    expect(result).toBeDefined();
  });
});
