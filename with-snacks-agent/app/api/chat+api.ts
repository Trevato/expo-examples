import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText, tool, UIMessage, convertToModelMessages } from "ai";
import { z } from "zod";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const SYSTEM_PROMPT = `You are an expert Expo and React Native developer assistant that helps users build mobile apps in real-time. You work like v0 by Vercel but for React Native/Expo apps.

Your primary job is to generate and iterate on Expo Snack code based on user requests. When a user describes an idea or asks for changes, you generate complete, working code.

## Guidelines:

1. **Always generate complete, working code** - Include all imports, styles, and exports
2. **Use modern React Native patterns** - Functional components, hooks, modern APIs
3. **Style with StyleSheet** - Use React Native's StyleSheet.create for consistent styling
4. **Keep it self-contained** - All code should work in a single App.js file for Snack compatibility
5. **Use Expo SDK features** - Leverage expo-* packages when appropriate (they work in Snacks)
6. **Make it visually appealing** - Use good color schemes, spacing, and typography
7. **Be responsive** - Ensure layouts work across different screen sizes

## Available Expo packages in Snacks:
- @expo/vector-icons - For icons (MaterialIcons, Ionicons, FontAwesome, etc.)
- expo-linear-gradient - For gradient backgrounds
- expo-blur - For blur effects
- expo-haptics - For haptic feedback
- react-native-reanimated - For animations
- react-native-gesture-handler - For gestures

## Response format:
- First briefly acknowledge the user's request
- Then use the generateSnack tool to generate the code
- Explain key features of the generated code

## Important:
- When iterating on existing code, maintain context and build upon previous versions
- If the user wants changes, generate the complete updated code (not just the diff)
- Focus on creating polished, production-quality UI`;

export async function POST(request: Request) {
  const { messages, currentCode }: { messages: UIMessage[]; currentCode?: string } =
    await request.json();

  // Add context about current code if available
  const contextMessages: UIMessage[] = currentCode
    ? [
        {
          id: "context-user",
          role: "user",
          parts: [{ type: "text", text: `Current snack code:\n\`\`\`javascript\n${currentCode}\n\`\`\`` }],
        },
        {
          id: "context-assistant",
          role: "assistant",
          parts: [{ type: "text", text: "I see your current code. What would you like me to change or add?" }],
        },
        ...messages,
      ]
    : messages;

  // Convert UI messages to model messages for AI SDK 6
  const modelMessages = await convertToModelMessages(contextMessages);

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: SYSTEM_PROMPT,
    messages: modelMessages,
    tools: {
      generateSnack: tool({
        description:
          "Generate complete Expo Snack code for a React Native app. Use this whenever the user asks for an app, component, or feature.",
        parameters: z.object({
          name: z.string().describe("A short, descriptive name for the snack"),
          description: z
            .string()
            .describe("Brief description of what the snack does"),
          code: z
            .string()
            .describe(
              "The complete JavaScript/TypeScript code for the Expo Snack. Must be valid, self-contained code that exports a default App component."
            ),
          dependencies: z
            .array(z.string())
            .optional()
            .describe(
              "Additional npm packages required (e.g., ['@expo/vector-icons', 'expo-linear-gradient'])"
            ),
        }),
        execute: async ({ name, description, code, dependencies }) => {
          // Return the snack configuration
          return {
            name,
            description,
            code,
            dependencies: dependencies || [],
            timestamp: Date.now(),
          };
        },
      }),
    },
    maxSteps: 3,
  });

  // Use AI SDK 6's toUIMessageStreamResponse for proper streaming
  return result.toUIMessageStreamResponse({
    headers: {
      // Required for iOS streaming support
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "none",
    },
  });
}
