/**
 * container.ts
 * Chịu trách nhiệm DUY NHẤT: Dependency Injection (DI) root.
 * - Khởi tạo tất cả repository instances
 * - Khởi tạo tất cả service instances (inject repo)
 * - Khởi tạo tất cả controller instances (inject service)
 * - Tạo tất cả routers (inject controller)
 * Không biết gì về server lifecycle hay HTTP layer.
 */
import { ProfileRepository } from './modules/profile/profile.repo.js';
import { StoryRepository } from './modules/story/story.repo.js';
import { ChapterRepository } from './modules/story/chapter.repo.js';
import { ApiKeyRepository } from './modules/apiKey/apiKey.repo.js';

import { AuthService } from './modules/auth/auth.service.js';
import { StoryService } from './modules/story/story.service.js';
import { ApiKeyService } from './modules/apiKey/apiKey.service.js';

import { GeminiProvider } from './infrastructure/ai/gemini.provider.js';
import { OpenAiProvider, OpenAiCompatibleProvider } from './infrastructure/ai/openai.provider.js';
import { OpenRouterProvider } from './infrastructure/ai/openrouter.provider.js';
import { TavilyProvider } from './infrastructure/search/tavily.provider.js';
import { GenerateStoryUseCase } from './modules/story/useCases/generateStory.useCase.js';
import { GenerateNextChapterUseCase } from './modules/story/useCases/generateNextChapter.useCase.js';

import { AuthController } from './modules/auth/auth.controller.js';
import { StoryController } from './modules/story/story.controller.js';
import { ApiKeyController } from './modules/apiKey/apiKey.controller.js';

import { createAuthRouter } from './modules/auth/auth.routes.js';
import { createStoryRouter } from './modules/story/story.routes.js';
import { createApiKeyRouter } from './modules/apiKey/apiKey.routes.js';

import neo4jRepository from './infrastructure/neo4j/neo4j.repository.js';
import { pingSupabase } from './infrastructure/supabase/supabase.health.js';

export interface ComposedApp {
  routes: {
    auth: ReturnType<typeof createAuthRouter>;
    stories: ReturnType<typeof createStoryRouter>;
    apiKeys: ReturnType<typeof createApiKeyRouter>;
  };
  healthCheck: () => Promise<{ postgres: string; neo4j: string; supabase: string }>;
}

/**
 * Khởi tạo toàn bộ dependency graph và trả về các routes đã được wire.
 */
export function composeApp(): ComposedApp {
  // ── Repositories ────────────────────────────────────────────────────────────
  const profileRepo = new ProfileRepository();
  const storyRepo = new StoryRepository();
  const chapterRepo = new ChapterRepository();
  const apiKeyRepo = new ApiKeyRepository();

  // ── Infrastructure ────────────────────────────────────────────────────────────
  const geminiProvider    = new GeminiProvider();
  const openaiProvider    = new OpenAiProvider();
  const openrouterProvider = new OpenRouterProvider();
  const nineRouterProvider = new OpenAiCompatibleProvider(
    process.env.NINE_ROUTER_URL || 'http://localhost:20128/v1'
  );
  const searchProvider = new TavilyProvider();

  const llmProviders: Record<string, any> = {
    'gemini':      geminiProvider,      // Google Gemini (generativelanguage.googleapis.com)
    'openai':      openaiProvider,      // OpenAI chính thức (api.openai.com)
    'openrouter':  openrouterProvider,  // OpenRouter gateway (openrouter.ai)
    '9router':     nineRouterProvider,  // 9Router / Local LLM (OpenAI-compatible)
  };

  // ── Services & UseCases ─────────────────────────────────────────────────────
  const authService = new AuthService(profileRepo);
  const storyService = new StoryService(storyRepo, chapterRepo);
  const apiKeyService = new ApiKeyService(apiKeyRepo);

  const generateStoryUseCase = new GenerateStoryUseCase(
    apiKeyService,
    llmProviders,
    searchProvider
  );

  const generateNextChapterUseCase = new GenerateNextChapterUseCase(
    apiKeyService,
    llmProviders
  );

  // ── Controllers ─────────────────────────────────────────────────────────────
  const authController = new AuthController(authService);
  const storyController = new StoryController(storyService, generateStoryUseCase, generateNextChapterUseCase);
  const apiKeyController = new ApiKeyController(apiKeyService);

  // ── Routers ─────────────────────────────────────────────────────────────────
  const routes = {
    auth: createAuthRouter(authController),
    stories: createStoryRouter(storyController),
    apiKeys: createApiKeyRouter(apiKeyController),
  };

  // ── Health Check ─────────────────────────────────────────────────────────────
  const healthCheck = async () => {
    const [postgres, neo4j, supabase] = await Promise.allSettled([
      profileRepo.ping(),
      neo4jRepository.ping(),
      pingSupabase(),
    ]);

    return {
      postgres: postgres.status === 'fulfilled' && postgres.value ? 'CONNECTED' : 'ERROR',
      neo4j: neo4j.status === 'fulfilled' && neo4j.value ? 'CONNECTED' : 'ERROR',
      supabase: supabase.status === 'fulfilled' && supabase.value ? 'CONNECTED' : 'ERROR',
    };
  };

  return { routes, healthCheck };
}
