import "dotenv/config";
import { defineConfig } from "@prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";

const configBase = {
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
} as const;

export default process.env.PRISMA_USE_JS_ENGINE === "1"
  ? defineConfig({
      ...configBase,
      experimental: { adapter: true },
      engine: "js",
      adapter: async () => new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
    })
  : defineConfig(configBase);
