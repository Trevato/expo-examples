# Expo Snacks AI Agent

<p>
  <a href="https://docs.expo.dev/versions/latest/">
    <img src="https://img.shields.io/badge/SDK-54-blue.svg" alt="Expo SDK 54" />
  </a>
  <a href="https://docs.expo.dev/versions/latest/">
    <img src="https://img.shields.io/badge/Platforms-iOS%20|%20Android%20|%20Web-green.svg" alt="Platforms" />
  </a>
</p>

An AI-powered app that generates and previews Expo Snacks in real-time. Inspired by [v0 by Vercel](https://v0.dev), this example demonstrates how to build an AI agent that helps you create React Native apps through natural conversation.

## Features

- **AI-Powered Code Generation**: Describe your app idea in plain English and watch it come to life
- **Real-Time Preview**: See your generated code running instantly via embedded Expo Snack
- **Iterative Development**: Build upon previous versions by asking for changes
- **Multi-Platform Preview**: Switch between Web, iOS, and Android previews
- **Modern UI**: Clean, dark-mode interface inspired by v0's mobile app

## How to Use

```bash
npx create-expo-app -e with-snacks-agent
```

Then add your Anthropic API key to `.env`:

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

Start the app:

```bash
npx expo start
```

## Technologies Used

- **[AI SDK 4](https://ai-sdk.dev/)**: Vercel's AI SDK for streaming chat and tool calling
- **[Anthropic Claude](https://www.anthropic.com/)**: Claude Sonnet for intelligent code generation
- **[Expo Router](https://docs.expo.dev/router/introduction/)**: File-based routing with API routes
- **[Expo Snacks](https://snack.expo.dev/)**: Embedded preview for generated React Native code
- **[NativeWind](https://www.nativewind.dev/)**: Tailwind CSS for React Native
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)**: Smooth animations

## Architecture

```
app/
├── _layout.tsx          # Root layout with providers
├── index.tsx            # Main screen (chat + preview)
└── api/
    └── chat+api.ts      # AI chat endpoint with tool calling

components/
├── ChatMessage.tsx      # Message bubbles with snack cards
├── ChatInput.tsx        # Input field with suggestions
├── EmptyState.tsx       # Welcome screen with example prompts
└── SnackPreview.tsx     # Embedded Snack preview

hooks/
└── useSnackAgent.ts     # Chat state and snack management

lib/
├── api-url.ts           # API URL helper for dev/prod
├── polyfills.ts         # Streaming polyfills for React Native
└── snack-templates.ts   # Snack embedding utilities
```

## How It Works

1. **User Input**: You describe an app idea (e.g., "Create a workout timer app")
2. **AI Processing**: Claude analyzes the request and generates complete React Native code
3. **Tool Calling**: The AI uses a `generateSnack` tool to structure the output
4. **Preview Rendering**: The generated code is embedded as an Expo Snack for live preview
5. **Iteration**: Ask for changes and the AI will update the code while maintaining context

## Example Prompts

- "Create a meditation timer with soothing animations"
- "Build a todo list with swipe-to-delete"
- "Make a music player UI with album art and controls"
- "Design a weather app with gradient backgrounds"

## Resources

- [AI SDK Documentation](https://ai-sdk.dev/docs/introduction)
- [Expo Snacks SDK](https://github.com/expo/snack/blob/main/docs/snack-sdk.md)
- [How We Built the v0 iOS App](https://vercel.com/blog/how-we-built-the-v0-ios-app)
- [Expo Router API Routes](https://docs.expo.dev/router/reference/api-routes/)

## Notes

- Requires Expo SDK 54+ for streaming support
- API key is stored server-side for security
- Works on iOS, Android, and Web platforms
