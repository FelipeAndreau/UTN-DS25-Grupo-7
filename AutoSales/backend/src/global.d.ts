// src/global.d.ts
import "node";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
      SUPABASE_URL?: string;
      SUPABASE_ANON_KEY?: string;
      [key: string]: string | undefined;
    }
  }
}

export {};