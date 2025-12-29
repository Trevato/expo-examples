# iOS Liquid Glass Playground

An interactive playground to experiment with Apple's new **Liquid Glass** design material introduced in iOS 26.

## Features

- **GlassView demos** - See both 'regular' (frosted blur) and 'clear' (minimal blur) glass effects
- **GlassContainer** - Experiment with element merging by adjusting spacing
- **Interactive controls** - Toggle interactivity, adjust spacing, and apply tint colors
- **Shape variations** - Circles, squares, and pills with glass effects
- **Haptic feedback** - Feel the glass interactions on supported devices
- **Animated elements** - Floating animations powered by Reanimated

## Requirements

- **iOS 26+** for native Liquid Glass effects
- **Xcode 26+** for building
- Falls back gracefully on older iOS versions and Android

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Run on iOS simulator (requires Xcode 26)
npx expo run:ios
```

## Controls

| Control | Description |
|---------|-------------|
| Glass Style | Toggle between 'regular' and 'clear' effects |
| Interactive | Enable/disable touch interaction effects |
| Use Container | Enable GlassContainer for merging effects |
| Spacing | Adjust how close elements need to be to merge |
| Tint Color | Apply a color overlay to the glass |

## API Reference

### GlassView Props

- `glassEffectStyle`: `'regular'` | `'clear'` - Visual effect mode
- `isInteractive`: `boolean` - Enable touch interaction effects (can only be set on mount)
- `tintColor`: `string` - Apply a color tint overlay

### GlassContainer Props

- `spacing`: `number` - Distance threshold for glass elements to merge together

### Utility Functions

- `isLiquidGlassAvailable()`: Returns `true` if running on iOS 26+

## Resources

- [Expo Glass Effect Documentation](https://docs.expo.dev/versions/latest/sdk/glass-effect/)
- [Apple Liquid Glass Design](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/)
- [Callstack Liquid Glass Library](https://github.com/callstack/liquid-glass)
