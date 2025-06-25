/**
 * AI Client Library
 *
 * This module provides a unified interface for interacting with various AI models
 * including OpenAI, Perplexity, and Google's Gemini models.
 *
 * Primary Functions:
 *
 * 1. generateChatCompletion(messages, model = "O1", options = {})
 *    - Main function for general AI interactions
 *    - Automatically handles routing to appropriate AI provider
 *    - Use for standard chat completions, idea generation, etc.
 *    Example:
 *    ```typescript
 *    const response = await generateChatCompletion([
 *      { role: "user", content: "Generate a business idea" }
 *    ]);
 *    ```
 *
 * 2. generateGeminiWebResponse(messages, model, ground = true)
 *    - Specialized function for Gemini models with web grounding
 *    - Returns both response text and source links
 *    - Use when you need factual, web-grounded responses
 *    Example:
 *    ```typescript
 *    const { text, sourceLink } = await generateGeminiWebResponse([
 *      { role: "user", content: "What's new in AI?" }
 *    ], "GEMINI_FLASH_WEB", true);
 *    ```
 *
 * 3. parseJsonResponse(response)
 *    - Utility to parse JSON from AI responses
 *    - Handles both direct JSON and code block formats
 *    - Use when expecting structured data from AI
 *    Example:
 *    ```typescript
 *    const data = parseJsonResponse(aiResponse);
 *    ```
 *
 * Available Models:
 * - O1: Default model for most use cases
 * - SONNET: Claude 3.5 Sonnet for complex reasoning
 * - PERPLEXITY_SMALL/LARGE: For web-aware responses
 * - GEMINI_FLASH_WEB: For web-grounded responses
 * - GEMINI_FLASH_THINKING: For complex reasoning tasks
 */

import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Custom type for Gemini API request
interface GeminiGroundedResponse {
  text: string;
  sourceLink?: string;
}

type AIClientType = {
  openai: OpenAI;
};

type AIClientResponse = {
  client: AIClientType[keyof AIClientType];
  type: keyof AIClientType;
};

export const AI_MODELS = {
  SONNET: "claude-3-5-sonnet-20241022",
  O1: "o1-2024-12-17",
  GPT_4O: "gpt-4o",
  GPT_4O_MINI: "gpt-4o-mini",
  PERPLEXITY_SMALL: "sonar",
  PERPLEXITY_LARGE: "sonar-pro",
  GEMINI_FLASH_WEB: "gemini-2.0-flash-exp",
  GEMINI_FLASH_THINKING: "gemini-2.0-flash-thinking-exp-01-21",
} as const;

export type AIModel = keyof typeof AI_MODELS;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const perplexity = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai",
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function getClientForModel(model: AIModel): AIClientResponse {
  const modelId = AI_MODELS[model];

  if (modelId.includes("sonar")) {
    return { client: perplexity, type: "openai" };
  }

  return { client: openai, type: "openai" };
}

/**
 * Generates a response from Gemini models with optional web grounding.
 * @param messages Array of message objects with role and content
 * @param model The Gemini model to use
 * @param ground Whether to enable web grounding
 * @returns Promise with text response and optional source links
 */
export async function generateGeminiWebResponse(
  messages: Array<{ role: "user" | "system" | "assistant"; content: string }>,
  model: AIModel = "GEMINI_FLASH_WEB",
  ground = true,
): Promise<GeminiGroundedResponse> {
  const modelId = AI_MODELS[model];
  const geminiModel = genAI.getGenerativeModel({
    model: modelId,
    // @ts-ignore
    tools: ground ? [{ googleSearch: {} }] : undefined,
  });

  // Convert messages to Gemini format
  const prompt = messages.map((m) => m.content).join("\n");

  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  let sourceLink: string | undefined = undefined;
  if (
    ground &&
    response.candidates?.[0]?.groundingMetadata?.searchEntryPoint
      ?.renderedContent
  ) {
    sourceLink =
      response.candidates[0].groundingMetadata.searchEntryPoint.renderedContent;
  }

  return {
    text,
    sourceLink,
  };
}

export function parseJsonResponse(response: string): any {
  // First try parsing the response directly
  try {
    return JSON.parse(response);
  } catch (e) {
    // If direct parsing fails, look for code blocks
    const codeBlockRegex = /```(?:json|[^\n]*\n)?([\s\S]*?)```/;
    const match = response.match(codeBlockRegex);

    if (match && match[1]) {
      try {
        return JSON.parse(match[1].trim());
      } catch (innerError) {
        throw new Error("Failed to parse JSON from code block");
      }
    }

    throw new Error("No valid JSON found in response");
  }
}

export async function generateChatCompletion(
  messages: Array<{ role: "user" | "system" | "assistant"; content: string }>,
  model: AIModel = "O1",
  additionalOptions: Partial<OpenAI.ChatCompletionCreateParamsNonStreaming> = {},
): Promise<string> {
  try {
    const modelId = AI_MODELS[model];

    // Handle Gemini models directly
    if (modelId.includes("gemini")) {
      const geminiResp = await generateGeminiWebResponse(
        messages,
        model,
        false,
      );
      return geminiResp.text;
    }

    // Handle OpenAI and Perplexity models
    const { client } = getClientForModel(model);
    const options: OpenAI.ChatCompletionCreateParamsNonStreaming = {
      model: modelId,
      messages,
      ...additionalOptions,
    };

    const completion = await client.chat.completions.create(options);
    return completion.choices[0]?.message?.content ?? "";
  } catch (error) {
    console.error(
      `Error generating chat completion for model ${model}:`,
      error,
    );
    throw error;
  }
}
