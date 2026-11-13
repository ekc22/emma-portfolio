import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { claudeModel, isClaudeConfigured } from "../env";

let client: Anthropic | null = null;

/** Shared Anthropic client. Credentials come from ANTHROPIC_API_KEY (or another SDK credential source). */
export function claude() {
  client ??= new Anthropic({ maxRetries: 2, timeout: 5 * 60 * 1000 });
  return client;
}

/**
 * Every request goes through the beta endpoint with server-side refusal fallbacks
 * enabled ("default" routes a declined request to a suitable fallback model).
 */
export async function createMessage(params: Omit<Anthropic.Beta.MessageCreateParamsNonStreaming, "model" | "betas" | "fallbacks">) {
  return claude().beta.messages.create({
    model: claudeModel(),
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    ...params,
  });
}

export class AiUnavailableError extends Error {}

/** Thrown when a person has used today's AI allowance. */
export class AiLimitError extends Error {}

export function assertClaude() {
  if (!isClaudeConfigured()) throw new AiUnavailableError("Claude is not configured. Add ANTHROPIC_API_KEY to the environment to use AI features.");
}

/** Plain-language error for the UI, without leaking internals. */
export function describeAiError(e: unknown): { status: number; message: string } {
  if (e instanceof AiLimitError) return { status: 429, message: e.message };
  if (e instanceof AiUnavailableError) return { status: 503, message: e.message };
  if (e instanceof Anthropic.AuthenticationError) return { status: 502, message: "Claude rejected the API key. Check ANTHROPIC_API_KEY." };
  if (e instanceof Anthropic.PermissionDeniedError) return { status: 502, message: "This API key does not have access to the configured model." };
  if (e instanceof Anthropic.RateLimitError) return { status: 429, message: "Claude is rate-limited right now. Try again in a minute." };
  if (e instanceof Anthropic.BadRequestError) return { status: 502, message: `Claude could not process the request: ${e.message}` };
  if (e instanceof Anthropic.APIConnectionError) return { status: 502, message: "Could not reach Claude. Check the network connection." };
  if (e instanceof Anthropic.APIError) return { status: 502, message: `Claude returned an error (${e.status}). Try again.` };
  return { status: 500, message: (e as Error)?.message || "Something went wrong." };
}

/** Joins the text blocks of a response. */
export function textOf(content: Anthropic.Beta.BetaContentBlock[]) {
  return content.filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text").map((b) => b.text).join("\n").trim();
}
