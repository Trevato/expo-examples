import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
  Switch,
  Platform,
} from 'react-native';
import { GlassView, GlassContainer, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Check if liquid glass is available
const liquidGlassSupported = isLiquidGlassAvailable();

export default function LiquidGlassPlayground() {
  const insets = useSafeAreaInsets();
  const [glassStyle, setGlassStyle] = useState<'regular' | 'clear'>('regular');
  const [isInteractive, setIsInteractive] = useState(true);
  const [showContainer, setShowContainer] = useState(true);
  const [spacing, setSpacing] = useState(20);
  const [tintColor, setTintColor] = useState<string | undefined>(undefined);

  // Animation values
  const floatY = useSharedValue(0);
  const scale = useSharedValue(1);

  // Start floating animation
  React.useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2000 }),
        withTiming(10, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.95),
      withSpring(1)
    );
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const pressableStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const tintColors = [
    { label: 'None', value: undefined },
    { label: 'Blue', value: 'rgba(0, 122, 255, 0.3)' },
    { label: 'Purple', value: 'rgba(175, 82, 222, 0.3)' },
    { label: 'Pink', value: 'rgba(255, 45, 85, 0.3)' },
    { label: 'Green', value: 'rgba(52, 199, 89, 0.3)' },
    { label: 'Orange', value: 'rgba(255, 149, 0, 0.3)' },
  ];

  const renderFallbackView = (children: React.ReactNode, style?: any) => (
    <View style={[styles.fallbackGlass, style]}>{children}</View>
  );

  const GlassOrFallback = ({ children, style, ...props }: any) => {
    if (!liquidGlassSupported) {
      return renderFallbackView(children, style);
    }
    return (
      <GlassView style={style} {...props}>
        {children}
      </GlassView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Animated gradient background */}
      <View style={styles.backgroundGradient}>
        <View style={[styles.gradientOrb, styles.orbPurple]} />
        <View style={[styles.gradientOrb, styles.orbBlue]} />
        <View style={[styles.gradientOrb, styles.orbPink]} />
        <View style={[styles.gradientOrb, styles.orbTeal]} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Liquid Glass</Text>
          <Text style={styles.subtitle}>iOS 26 Playground</Text>
          <Text style={styles.status}>
            {liquidGlassSupported ? '✓ Liquid Glass Available' : '⚠ Using Fallback (iOS 26 required)'}
          </Text>
        </View>

        {/* Demo Section: Basic Glass Views */}
        <Text style={styles.sectionTitle}>Basic Glass Views</Text>
        <Animated.View style={floatingStyle}>
          {showContainer && liquidGlassSupported ? (
            <GlassContainer spacing={spacing} style={styles.demoContainer}>
              <GlassOrFallback
                style={styles.glassCard}
                glassEffectStyle={glassStyle}
                isInteractive={isInteractive}
                tintColor={tintColor}
                key={`card1-${isInteractive}`}
              >
                <Text style={styles.cardIcon}>🌟</Text>
                <Text style={styles.cardTitle}>Regular</Text>
                <Text style={styles.cardSubtitle}>Frosted blur effect</Text>
              </GlassOrFallback>

              <GlassOrFallback
                style={styles.glassCard}
                glassEffectStyle="clear"
                isInteractive={isInteractive}
                tintColor={tintColor}
                key={`card2-${isInteractive}`}
              >
                <Text style={styles.cardIcon}>💎</Text>
                <Text style={styles.cardTitle}>Clear</Text>
                <Text style={styles.cardSubtitle}>Minimal blur</Text>
              </GlassOrFallback>
            </GlassContainer>
          ) : (
            <View style={styles.demoContainer}>
              <GlassOrFallback
                style={styles.glassCard}
                glassEffectStyle={glassStyle}
                isInteractive={isInteractive}
                tintColor={tintColor}
                key={`card1-${isInteractive}`}
              >
                <Text style={styles.cardIcon}>🌟</Text>
                <Text style={styles.cardTitle}>Regular</Text>
                <Text style={styles.cardSubtitle}>Frosted blur effect</Text>
              </GlassOrFallback>

              <GlassOrFallback
                style={styles.glassCard}
                glassEffectStyle="clear"
                isInteractive={isInteractive}
                tintColor={tintColor}
                key={`card2-${isInteractive}`}
              >
                <Text style={styles.cardIcon}>💎</Text>
                <Text style={styles.cardTitle}>Clear</Text>
                <Text style={styles.cardSubtitle}>Minimal blur</Text>
              </GlassOrFallback>
            </View>
          )}
        </Animated.View>

        {/* Interactive Button Demo */}
        <Text style={styles.sectionTitle}>Interactive Glass Button</Text>
        <Animated.View style={pressableStyle}>
          <Pressable onPress={handlePress}>
            <GlassOrFallback
              style={styles.glassButton}
              glassEffectStyle={glassStyle}
              isInteractive={true}
              tintColor={tintColor}
            >
              <Text style={styles.buttonText}>Tap Me</Text>
              <Text style={styles.buttonSubtext}>Feel the haptic feedback</Text>
            </GlassOrFallback>
          </Pressable>
        </Animated.View>

        {/* Shapes Demo */}
        <Text style={styles.sectionTitle}>Glass Shapes</Text>
        {liquidGlassSupported ? (
          <GlassContainer spacing={spacing} style={styles.shapesContainer}>
            <GlassOrFallback
              style={styles.glassCircle}
              glassEffectStyle={glassStyle}
              isInteractive={isInteractive}
              tintColor={tintColor}
            >
              <Text style={styles.shapeIcon}>⭐</Text>
            </GlassOrFallback>

            <GlassOrFallback
              style={styles.glassSquare}
              glassEffectStyle={glassStyle}
              isInteractive={isInteractive}
              tintColor={tintColor}
            >
              <Text style={styles.shapeIcon}>🔮</Text>
            </GlassOrFallback>

            <GlassOrFallback
              style={styles.glassPill}
              glassEffectStyle={glassStyle}
              isInteractive={isInteractive}
              tintColor={tintColor}
            >
              <Text style={styles.shapeIcon}>✨</Text>
            </GlassOrFallback>
          </GlassContainer>
        ) : (
          <View style={styles.shapesContainer}>
            <GlassOrFallback style={styles.glassCircle}>
              <Text style={styles.shapeIcon}>⭐</Text>
            </GlassOrFallback>
            <GlassOrFallback style={styles.glassSquare}>
              <Text style={styles.shapeIcon}>🔮</Text>
            </GlassOrFallback>
            <GlassOrFallback style={styles.glassPill}>
              <Text style={styles.shapeIcon}>✨</Text>
            </GlassOrFallback>
          </View>
        )}

        {/* Merging Demo */}
        <Text style={styles.sectionTitle}>Glass Merging Effect</Text>
        <Text style={styles.sectionDescription}>
          Adjust spacing to see elements merge together
        </Text>
        {liquidGlassSupported ? (
          <GlassContainer spacing={spacing} style={styles.mergingContainer}>
            <GlassOrFallback
              style={styles.mergingBubble}
              glassEffectStyle={glassStyle}
              isInteractive={isInteractive}
              tintColor={tintColor}
            >
              <Text style={styles.bubbleText}>A</Text>
            </GlassOrFallback>
            <GlassOrFallback
              style={styles.mergingBubble}
              glassEffectStyle={glassStyle}
              isInteractive={isInteractive}
              tintColor={tintColor}
            >
              <Text style={styles.bubbleText}>B</Text>
            </GlassOrFallback>
            <GlassOrFallback
              style={styles.mergingBubble}
              glassEffectStyle={glassStyle}
              isInteractive={isInteractive}
              tintColor={tintColor}
            >
              <Text style={styles.bubbleText}>C</Text>
            </GlassOrFallback>
          </GlassContainer>
        ) : (
          <View style={styles.mergingContainer}>
            <GlassOrFallback style={styles.mergingBubble}>
              <Text style={styles.bubbleText}>A</Text>
            </GlassOrFallback>
            <GlassOrFallback style={styles.mergingBubble}>
              <Text style={styles.bubbleText}>B</Text>
            </GlassOrFallback>
            <GlassOrFallback style={styles.mergingBubble}>
              <Text style={styles.bubbleText}>C</Text>
            </GlassOrFallback>
          </View>
        )}

        {/* Controls Section */}
        <Text style={styles.sectionTitle}>Playground Controls</Text>
        <GlassOrFallback
          style={styles.controlsCard}
          glassEffectStyle="regular"
          tintColor={tintColor}
        >
          {/* Glass Style Toggle */}
          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Glass Style</Text>
            <View style={styles.segmentedControl}>
              <Pressable
                style={[
                  styles.segment,
                  glassStyle === 'regular' && styles.segmentActive,
                ]}
                onPress={() => setGlassStyle('regular')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    glassStyle === 'regular' && styles.segmentTextActive,
                  ]}
                >
                  Regular
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.segment,
                  glassStyle === 'clear' && styles.segmentActive,
                ]}
                onPress={() => setGlassStyle('clear')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    glassStyle === 'clear' && styles.segmentTextActive,
                  ]}
                >
                  Clear
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Interactive Toggle */}
          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Interactive</Text>
            <Switch
              value={isInteractive}
              onValueChange={setIsInteractive}
              trackColor={{ false: '#444', true: '#007AFF' }}
            />
          </View>

          {/* Container Toggle */}
          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Use Container</Text>
            <Switch
              value={showContainer}
              onValueChange={setShowContainer}
              trackColor={{ false: '#444', true: '#007AFF' }}
            />
          </View>

          {/* Spacing Slider */}
          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Spacing: {spacing}px</Text>
            <View style={styles.sliderContainer}>
              {[0, 10, 20, 40, 80].map((value) => (
                <Pressable
                  key={value}
                  style={[
                    styles.sliderButton,
                    spacing === value && styles.sliderButtonActive,
                  ]}
                  onPress={() => setSpacing(value)}
                >
                  <Text
                    style={[
                      styles.sliderButtonText,
                      spacing === value && styles.sliderButtonTextActive,
                    ]}
                  >
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Tint Color */}
          <View style={styles.controlColumn}>
            <Text style={styles.controlLabel}>Tint Color</Text>
            <View style={styles.colorPicker}>
              {tintColors.map((color) => (
                <Pressable
                  key={color.label}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color.value || '#333' },
                    tintColor === color.value && styles.colorButtonActive,
                  ]}
                  onPress={() => setTintColor(color.value)}
                >
                  <Text style={styles.colorButtonText}>{color.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </GlassOrFallback>

        {/* Info Card */}
        <GlassOrFallback style={styles.infoCard} glassEffectStyle="clear">
          <Text style={styles.infoTitle}>About Liquid Glass</Text>
          <Text style={styles.infoText}>
            Liquid Glass is Apple's new design material introduced in iOS 26.
            It creates a translucent, glass-like appearance that reflects and
            refracts surroundings in real-time.
          </Text>
          <Text style={styles.infoText}>
            • GlassView: Individual glass elements{'\n'}
            • GlassContainer: Groups elements for merging{'\n'}
            • isInteractive: Enables touch effects{'\n'}
            • glassEffectStyle: 'regular' or 'clear'
          </Text>
        </GlassOrFallback>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradientOrb: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.6,
  },
  orbPurple: {
    width: 300,
    height: 300,
    backgroundColor: '#8b5cf6',
    top: -50,
    left: -50,
  },
  orbBlue: {
    width: 250,
    height: 250,
    backgroundColor: '#3b82f6',
    top: 200,
    right: -100,
  },
  orbPink: {
    width: 200,
    height: 200,
    backgroundColor: '#ec4899',
    bottom: 200,
    left: -50,
  },
  orbTeal: {
    width: 280,
    height: 280,
    backgroundColor: '#14b8a6',
    bottom: -50,
    right: -50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginTop: 30,
    marginBottom: 16,
  },
  sectionDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginTop: -10,
    marginBottom: 16,
  },
  demoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  glassCard: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  fallbackGlass: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  glassButton: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  buttonSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  shapesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  glassCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassSquare: {
    width: 80,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassPill: {
    width: 100,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shapeIcon: {
    fontSize: 28,
  },
  mergingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
  },
  mergingBubble: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  bubbleText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  controlsCard: {
    padding: 20,
    borderRadius: 24,
    gap: 20,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlColumn: {
    gap: 12,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    padding: 2,
  },
  segment: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  segmentActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  segmentText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  segmentTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  sliderContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sliderButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sliderButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sliderButtonText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  sliderButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonActive: {
    borderColor: '#fff',
  },
  colorButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  infoCard: {
    padding: 20,
    borderRadius: 24,
    marginTop: 30,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
    marginBottom: 12,
  },
});
