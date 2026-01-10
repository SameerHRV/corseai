import { inngest } from "./client";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const demoGenerate = inngest.createFunction(
  { id: "demo-generate" },
  { event: "demo/generate" },
  async ({ step }) => {
    await step.run("generate-text", async () => {
      return await generateText({
        model: google("gemini-flash-latest"),
        prompt: "Write a short story about a robot learning to love",
        maxOutputTokens: 100,
        temperature: 0.2,
        topP: 0.9,
      });
    });
  }
);
